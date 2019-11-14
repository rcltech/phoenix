import { Room, User } from "../generated/prisma-client";
import { resolveUserUsingJWT } from "../utils/resolveUser";

const createBooking = async (parent, data , ctx) => {
  const start : Date = new Date(data.start);
  const end : Date = new Date(data.end);
  const room : Room  = await ctx.prisma.rooms({
    where: {number: data.room_number}
  });
  const user : User = await resolveUserUsingJWT(ctx);
  return ctx.prisma.createBooking({
    user : {
      connect: {
        username: user.username
      }
    },
    start,
    end,
    id: undefined,
    room: {
      connect: {
        number: room[0].number
      }
    }
  })
};

export { createBooking };
