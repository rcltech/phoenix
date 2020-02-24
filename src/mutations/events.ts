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
  const image_url: string = data.image_url;
  const description: string = data.description;

  const event: Event = await ctx.prisma.createEvent({
    title,
    start,
    end,
    venue,
    image_url,
    description,
    user: {
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
  const eventUser: User = ctx.prisma.events({ id }).user();
  assert.strictEqual(currentUser.id, eventUser.id, "User is not allowed");

  return ctx.prisma.deleteEvent({ id });
};

export { createEvent, deleteEvent };
