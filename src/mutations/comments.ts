import { Arg, Authorized, Ctx, ID, Mutation, Resolver } from "type-graphql";
import { User, Comment } from "../generated/typegraphql-prisma";
import { AppContext } from "../context";
import { isAuthenticated, isCommentAuthor } from "../authorization/rules";

@Resolver()
export class CommentMutationResolvers {
  @Authorized(isAuthenticated)
  @Mutation(() => Comment)
  async createComment(
    @Arg("eventId", () => ID, { nullable: true }) eventId: string,
    @Arg("content") content: string,
    @Ctx() ctx: AppContext
  ): Promise<Comment> {
    const currentUser: User = ctx.auth.user;
    const userId: string = currentUser.id;

    if (eventId) {
      return ctx.prisma.comment.create({
        data: {
          content,
          user: {
            connect: {
              id: userId,
            },
          },
          event: {
            connect: {
              id: eventId,
            },
          },
        },
      });
    } else throw new Error("No id of a particular data type is provided");
  }

  @Authorized([isAuthenticated, isCommentAuthor])
  @Mutation(() => Comment)
  async deleteComment(
    @Arg("id", () => ID) id: string,
    @Ctx() ctx: AppContext
  ): Promise<Comment> {
    return ctx.prisma.comment.delete({
      where: { id },
    });
  }
}
