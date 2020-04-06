import assert from "assert";
import { Event, User } from "../../generated/prisma-client";
import { resolveUserUsingJWT } from "../../utils/resolveUser";

const addEventSubscriber = async (parent, { id }, ctx): Promise<Event> => {
  const currentUser: User | null = await resolveUserUsingJWT(ctx);
  assert.notStrictEqual(currentUser, null, "No user login");

  const { id: user_id } = currentUser;

  return ctx.prisma.updateEvent({
    data: {
      subscribers: {
        connect: { id: user_id },
      },
    },
    where: {
      id,
    },
  });
};

const removeEventSubscriber = async (parent, { id }, ctx): Promise<Event> => {
  const currentUser: User | null = await resolveUserUsingJWT(ctx);
  assert.notStrictEqual(currentUser, null, "No user login");

  const { id: user_id } = currentUser;

  return ctx.prisma.updateEvent({
    data: {
      subscribers: {
        disconnect: { id: user_id },
      },
    },
    where: {
      id,
    },
  });
};

export { addEventSubscriber, removeEventSubscriber };
