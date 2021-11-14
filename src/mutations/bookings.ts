import { Arg, Ctx, Mutation, Resolver, ID } from "type-graphql";
import { Booking, Room, User } from "../generated/typegraphql-prisma";
import { AppContext } from "../context";

import { validateBooking } from "../utils/validateBooking";
import { sendEmail } from "../utils/email/sendEmail";

@Resolver()
export class BookingMutationResolvers {
  @Mutation(() => Booking)
  async createBooking(
    @Arg("room_number") room_number: string,
    @Arg("start") start: string,
    @Arg("end") end: string,
    @Arg("remark", { nullable: true }) remark: string,
    @Ctx() ctx: AppContext
  ): Promise<Booking> {
    const user: User = ctx.auth.user;
    const room: Room = await ctx.prisma.room.findUnique({
      where: { number: room_number },
    });

    if (!room) throw new Error("Room to be booked not found");

    const validity: boolean = await validateBooking(
      room.number,
      { start: new Date(start), end: new Date(end) },
      ctx
    );
    if (!validity) throw new Error("Booking time is not valid");

    const booking: Booking = await ctx.prisma.booking.create({
      data: {
        user: {
          connect: {
            username: user.username,
          },
        },
        start: new Date(start),
        end: new Date(end),
        remark,
        room: {
          connect: {
            number: room.number,
          },
        },
      },
    });

    await sendEmail({ user, booking, room });

    return booking;
  }

  @Mutation(() => Booking)
  async updateBooking(
    @Arg("id", () => ID) id: string,
    @Arg("room_number", { nullable: true }) room_number: string,
    @Arg("start", { nullable: true }) start: string,
    @Arg("end", { nullable: true }) end: string,
    @Arg("remark", { nullable: true }) remark: string,
    @Ctx() ctx: AppContext
  ): Promise<Booking> {
    const room: Room = room_number
      ? await ctx.prisma.room.findUnique({
          where: { number: room_number },
        })
      : await ctx.prisma.booking.findUnique({ where: { id } }).room();

    if (!room) throw new Error("Room to be booked not found");

    if (start || end) {
      const bookingTimes = [start, end];
      if (!bookingTimes.every((time) => !!time))
        throw new Error("Missing either start / end booking time");

      const validity: boolean = await validateBooking(
        room.number,
        { start: new Date(start), end: new Date(end) },
        ctx,
        id
      );
      if (!validity) throw new Error("Booking time is not valid");
    }

    return ctx.prisma.booking.update({
      data: {
        start: start ? new Date(start) : undefined,
        end: end ? new Date(end) : undefined,
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
  }

  @Mutation(() => Booking)
  async deleteBooking(
    @Arg("id", () => ID) id: string,
    @Ctx() ctx: AppContext
  ): Promise<Booking> {
    return ctx.prisma.booking.delete({ where: { id } });
  }
}
