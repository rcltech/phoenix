import { Event, User } from "../generated/prisma-client";
import { resolveUserUsingJWT } from "../utils/resolveUser";
import assert from "assert";

const createEvent = async (parent, data, ctx): Promise<Event> => {
  const user: User | null = await resolveUserUsingJWT(ctx);
  assert.notStrictEqual(user, null, "No user login");

  const title: string = data.title;
  const start: Date = new Date(data.start);
  const end: Date = new Date(data.end);
  const venue: string = data.venue;
  const image_base64: string = data.image_base64;
  const description: string = data.description;

  //image_url should be a link pointing to S3
  //a utility function to be further implemented
  const image_url = image_base64;

  const event: Event = await ctx.prisma.createEvent({
    title,
    start,
    end,
    venue,
    image_url,
    description,
    organiser: {
      connect: {
        id: user.id,
      },
    },
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
