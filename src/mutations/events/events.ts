import env from "dotenv";
import { Arg, Authorized, Ctx, ID, Mutation, Resolver } from "type-graphql";
import { Event, User } from "../../generated/typegraphql-prisma";

import { AppContext } from "../../context";

import { uploadToS3, deleteFromS3 } from "../../utils/S3";
import { S3UploadResponse, S3DeleteResponse } from "../../utils/S3/types";
import { isImageValid } from "../../utils/validateImage";
import { isAuthenticated, isEventOrganiser } from "../../authorization/rules";

env.config();

const bucket_suffix =
  process.env.NODE_ENV === "development" ? "dev" : "production";
const bucket_name = `rctechclub-raven/${bucket_suffix}`;

@Resolver()
export class EventMutationResolvers {
  @Authorized(isAuthenticated)
  @Mutation(() => Event)
  async createEvent(
    @Arg("title") title: string,
    @Arg("start") start: string,
    @Arg("end") end: string,
    @Arg("venue") venue: string,
    @Arg("image_base64") image_base64: string,
    @Arg("description", { nullable: true }) description: string,
    @Ctx() ctx: AppContext
  ): Promise<Event> {
    const user: User = ctx.auth.user;

    const event: Event = await ctx.prisma.event.create({
      data: {
        title,
        start: new Date(start),
        end: new Date(end),
        venue,
        description,
        image_url: "",
        organiser: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    const { id } = event;

    // check if image_base64 is less than 10mb, if not, delete event and return null
    const sizeLimit = 10 * 1000000;
    const imageValidity = isImageValid(image_base64, sizeLimit);
    if (!imageValidity) {
      await ctx.prisma.event.delete({ where: { id } });
      return null;
    }

    // check if image is an empty string, then do not upload to S3, but return event
    const isImageEmpty = image_base64 === "";
    if (isImageEmpty) {
      return event;
    }

    //Store image_base64 to S3 bucket with filename <event.id>
    //And retrieve image_url back to be stored in the database
    const s3UploadResponse: S3UploadResponse = await uploadToS3({
      image_base64,
      file_name: id,
      bucket_name,
    });
    const { isSuccessful, image_url } = s3UploadResponse;

    // if there's an error in uploading image to S3
    // then delete pre-created event and throw error
    if (!isSuccessful) {
      await ctx.prisma.event.delete({ where: { id } });
      throw new Error("Unable to upload image to S3");
    }

    return ctx.prisma.event.update({
      data: { image_url },
      where: { id },
    });
  }

  @Authorized([isAuthenticated, isEventOrganiser])
  @Mutation(() => Event)
  async deleteEvent(
    @Arg("id", () => ID) id: string,
    @Ctx() ctx: AppContext
  ): Promise<Event> {
    const s3DeleteResponse: S3DeleteResponse = await deleteFromS3({
      file_name: id,
      bucket_name,
    });
    const { isSuccessful } = s3DeleteResponse;

    // throw error if unable to delete image from S3
    if (!isSuccessful) {
      throw new Error("Unable to delete image from S3");
    }

    return ctx.prisma.event.delete({ where: { id } });
  }
}
