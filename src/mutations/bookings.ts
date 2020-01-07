import { Room, User } from "../generated/prisma-client";
import { resolveUserUsingJWT } from "../utils/resolveUser";

const createBooking = async (parent, data, ctx) => {
  const start: Date = new Date(data.start);
  const end: Date = new Date(data.end);
  // TODO: Change the query for the room to unique
  const room: Room = await ctx.prisma.rooms({
    where: { number: data.room_number },
  });
  const user: User = await resolveUserUsingJWT(ctx);
  return ctx.prisma.createBooking({
    user: {
      connect: {
        username: user.username,
      },
    },
    start,
    end,
    id: undefined,
    room: {
      connect: {
        number: room[0].number,
      },
    },
  });
};

const updateBooking = async (parent, data, ctx) => {
  await resolveUserUsingJWT(ctx);
  const start: Date = new Date(data.start);
  const end: Date = new Date(data.end);
  // TODO: Change the query for the room to unique
  const room: Room = await ctx.prisma.rooms({
    where: { number: data.room_number },
  });
  const id = data.id;
  delete data.id;
  return ctx.prisma.updateBooking({
    data: {
      start,
      end,
      room: {
        connect: {
          number: room[0].number,
        },
      },
    },
    where: {
      id,
    },
  });
};

const deleteBooking = async (parent, { id }, ctx) => {
  await resolveUserUsingJWT(ctx);
  return ctx.prisma.deleteBooking({ id });
};

export { createBooking, updateBooking, deleteBooking };
