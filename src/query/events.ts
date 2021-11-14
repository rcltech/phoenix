import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { Event, EventWhereInput } from "../generated/typegraphql-prisma";
import moment from "moment";
import { AppContext } from "../context";

@Resolver()
export class EventQueryResolvers {
  @Query(() => [Event])
  async events(
    @Arg("data", { nullable: true }) data: EventWhereInput,
    @Arg("start_limit", { nullable: true }) start_limit: string,
    @Ctx() ctx: AppContext
  ): Promise<Event[]> {
    const end_gte: Date = moment(start_limit, moment.defaultFormat).isValid()
      ? new Date(start_limit)
      : undefined;
    return ctx.prisma.event.findMany({
      where: { ...data, end: { gte: end_gte } },
      orderBy: { start: "asc" },
    });
  }
}
