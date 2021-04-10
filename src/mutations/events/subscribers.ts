import { Event, User } from "@prisma/client";
import { AppContext } from "../../context";

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

const removeEventSubscriber = async (
  parent,
  { id },
  ctx: AppContext
): Promise<Event> => {
  const currentUser: User = ctx.auth.user;
  const { id: user_id } = currentUser;

  const event = await ctx.prisma.event.findUnique({
    where: { id },
    include: { subscribers: true },
  });
  const subscribersID: string[] = event.subscribers.map(({ id }) => id);

  if (subscribersID.includes(user_id)) {
    return ctx.prisma.event.update({
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

  return event;
};

export { addEventSubscriber, removeEventSubscriber };
