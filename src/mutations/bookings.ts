import { Booking, Room, User } from "../generated/prisma-client";
import { resolveUserUsingJWT } from "../utils/resolveUser";

const createBooking = async (parent, data, ctx): Promise<Booking> => {
  const start: Date = new Date(data.start);
  const end: Date = new Date(data.end);
  const remark: String = data.remark;
  const room: Room = await ctx.prisma.room({
    number: data.room_number,
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
    remark,
    room: {
      connect: {
        number: room.number,
      },
    },
  });
};

const updateBooking = async (parent, data, ctx): Promise<Booking> => {
  await resolveUserUsingJWT(ctx);
  const start: Date = new Date(data.start);
  const end: Date = new Date(data.end);
  const remark: String = data.remark;
  const room: Room = await ctx.prisma.room({
    number: data.room_number,
  });
  const id = data.id;
  return ctx.prisma.updateBooking({
    data: {
      start,
      end,
      remark,
      room: {
        connect: {
          number: room.number,
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
