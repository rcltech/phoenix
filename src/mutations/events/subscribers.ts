import { Arg, Authorized, Ctx, ID, Mutation, Resolver } from "type-graphql";
import { Event, User } from "../../generated/typegraphql-prisma";
import { AppContext } from "../../context";
import { isAuthenticated } from "../../authorization/rules";

@Resolver()
export class EventSubscribersMutationResolvers {
  @Authorized(isAuthenticated)
  @Mutation(() => Event)
  async addEventSubscriber(
    @Arg("id", () => ID) id: string,
    @Ctx() ctx: AppContext
  ): Promise<Event> {
    const currentUser: User = ctx.auth.user;

    return ctx.prisma.event.update({
      data: {
        subscribers: {
          connect: { id: currentUser.id },
        },
      },
      where: {
        id,
      },
    });
  }

  @Authorized(isAuthenticated)
  @Mutation(() => Event)
  async removeEventSubscriber(
    @Arg("id", () => ID) id: string,
    @Ctx() ctx: AppContext
  ): Promise<Event> {
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
  }
}
