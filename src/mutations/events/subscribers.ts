import assert from "assert";
import { Event, User } from "../../generated/prisma-client";

const addEventSubscriber = async (parent, { id }, ctx): Promise<Event> => {
  const currentUser: User = ctx.auth.user;
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
  const currentUser: User = ctx.auth.user;
  const { id: user_id } = currentUser;

  const subscribers: [User] = await ctx.prisma.event({ id }).subscribers();
  const subscribersID: string[] = subscribers.map(({ id }) => id);

  if (subscribersID.includes(user_id)) {
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
  }

  return ctx.prisma.event({ id });
};

export { addEventSubscriber, removeEventSubscriber };
