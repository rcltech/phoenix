import { Event, User } from "../generated/prisma-client";
import { resolveUserUsingJWT } from "../utils/resolveUser";
import { uploadImageToS3 } from "../utils/uploadImageToS3";
import assert from "assert";

const createEvent = async (parent, data, ctx): Promise<Event> | null => {
  const user: User | null = await resolveUserUsingJWT(ctx);
  assert.notStrictEqual(user, null, "No user login");

  const title: string = data.title;
  const start: Date = new Date(data.start);
  const end: Date = new Date(data.end);
  const venue: string = data.venue;
  const image_base64: string = data.image_base64;
  const description: string = data.description;

  let event: Event = await ctx.prisma.createEvent({
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

  //Store image_base64 to S3 bucket with filename <event.id>
  //And retrieve image_url back to be stored in the database
  const { id }: { id: string } = event;
  const image_url: string | null = await uploadImageToS3({
    image_base64,
    file_name: id,
  });

  //return null if unable to upload image to S3
  if (!image_url) return null;

  event = await ctx.prisma.updateEvent({
    data: { image_url },
    where: { id },
  });

  return event;
};

const deleteEvent = async (parent, data, ctx): Promise<Event> => {
  const currentUser: User | null = await resolveUserUsingJWT(ctx);
  assert.notStrictEqual(currentUser.id, null, "");

  const id: string = data.id;
  const eventOrganiser: User = await ctx.prisma.event({ id }).organiser();
  assert.strictEqual(currentUser.id, eventOrganiser.id, "User is not allowed");

  return ctx.prisma.deleteEvent({ id });
};

export { createEvent, deleteEvent };
