import env from "dotenv";
import { Event, User } from "../../generated/prisma-client";
import { resolveUserUsingJWT } from "../../utils/resolveUser";
import { uploadToS3, deleteFromS3 } from "../../utils/S3";
import { S3UploadResponse, S3DeleteResponse } from "../../utils/S3/types";
import assert from "assert";
import { isImageValid } from "../../utils/validateImage";

env.config();
const bucket_suffix =
  process.env.NODE_ENV === "development" ? "dev" : "production";
const bucket_name = `rctechclub-raven/${bucket_suffix}`;

const createEvent = async (
  parent,
  { title, start, end, venue, image_base64, description },
  ctx
): Promise<Event> | null => {
  const user: User | null = await resolveUserUsingJWT(ctx);
  assert.notStrictEqual(user, null, "No user login");

  start = new Date(start);
  end = new Date(end);

  const event: Event = await ctx.prisma.createEvent({
    title,
    start,
    end,
    venue,
    description,
    image_url: "",
    organiser: {
      connect: {
        id: user.id,
      },
    },
  });

  const { id } = event;

  // check if image_base64 is less than 10mb, if not, delete event and return null
  const sizeLimit = 10 * 1000000;
  const imageValidity = isImageValid(image_base64, sizeLimit);
  if (!imageValidity) {
    await ctx.prisma.deleteEvent({ id });
    return null;
  }

  // check if image is an empty string, then do not upload to S3, but return event
  const isImageEmpty = image_base64 === "";
  if (isImageEmpty) {
    return event;
  }

  //Store image_base64 to S3 bucket with filename <event.id>
  //And retrieve image_url back to be stored in the database
  const S3UploadResponse: S3UploadResponse = await uploadToS3({
    image_base64,
    file_name: id,
    bucket_name,
  });
  const { isSuccessful, image_url } = S3UploadResponse;

  //if there's an error in uploading image to S3
  //then delete pre-created event and return null
  if (!isSuccessful) {
    await ctx.prisma.deleteEvent({ id });
    return null;
  }

  return ctx.prisma.updateEvent({
    data: { image_url },
    where: { id },
  });
};

const deleteEvent = async (parent, { id }, ctx): Promise<Event> | null => {
  const currentUser: User | null = await resolveUserUsingJWT(ctx);
  assert.notStrictEqual(currentUser.id, null, "");

  const eventOrganiser: User = await ctx.prisma.event({ id }).organiser();
  assert.strictEqual(currentUser.id, eventOrganiser.id, "User is not allowed");

  const S3DeleteResponse: S3DeleteResponse = await deleteFromS3({
    file_name: id,
    bucket_name,
  });
  const { isSuccessful } = S3DeleteResponse;

  //return null if unable to delete image from S3
  if (!isSuccessful) return null;

  return ctx.prisma.deleteEvent({ id });
};

export { createEvent, deleteEvent };
