import { Booking, Room, User } from "@prisma/client";

import { sendEmail } from "../utils/email/sendEmail";
import { validateBooking } from "../utils/validateBooking";
import { AppContext } from "../context";

const createBooking = async (
  parent,
  data,
  ctx: AppContext
): Promise<Booking> => {
  const user: User = ctx.auth.user;
  const start: Date = new Date(data.start);
  const end: Date = new Date(data.end);
  const remark: string = data.remark;
  const room: Room = await ctx.prisma.room.findUnique({
    where: { number: data.room_number },
  });

  const validity: boolean = await validateBooking(
    room.number,
    { start, end },
    ctx
  );
  if (!validity) return null;

  const booking: Booking = await ctx.prisma.booking.create({
    data: {
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
    },
  });
  sendEmail({ user, booking, room });
  return booking;
};

const updateBooking = async (
  parent,
  data,
  ctx: AppContext
): Promise<Booking> => {
  const start: Date = new Date(data.start);
  const end: Date = new Date(data.end);
  const remark: string = data.remark;
  const room: Room = await ctx.prisma.room.findUnique({
    where: { number: data.room_number },
  });
  const id = data.id;

  return ctx.prisma.booking.update({
    data: {
      start,
      end,
      remark,
      room: {
        connect: {
          number: data.room_number,
        },
      },
    },
    where: {
      id,
    },
  });
};

const deleteBooking = async (
  parent,
  { id },
  ctx: AppContext
): Promise<Booking> => {
  return ctx.prisma.booking.delete({ where: { id } });
};

export { createBooking, updateBooking, deleteBooking };
