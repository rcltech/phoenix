import { Arg, Ctx, Query, Resolver } from "type-graphql";
import {
  Booking,
  BookingWhereInput,
  Room,
  RoomWhereInput,
} from "../generated/typegraphql-prisma";
import moment from "moment";
import { AppContext } from "../context";

@Resolver()
export class BookingQueryResolvers {
  @Query(() => [Booking])
  async bookings(
    @Arg("data", { nullable: true }) data: BookingWhereInput,
    @Arg("start_limit", { nullable: true }) start_limit: string,
    @Ctx() ctx: AppContext
  ): Promise<Booking[]> {
    const end_gte: Date = moment(start_limit, moment.defaultFormat).isValid()
      ? new Date(start_limit)
      : new Date();
    return await ctx.prisma.booking.findMany({
      where: { ...data, end: { gte: end_gte } },
      orderBy: { start: "asc" },
    });
  }
}

export class RoomQueryResolvers {
  @Query(() => [Room])
  async rooms(
    @Arg("data", { nullable: true }) data: RoomWhereInput,
    @Ctx() ctx: AppContext
  ): Promise<Room[]> {
    return ctx.prisma.room.findMany({ where: data });
  }
}
