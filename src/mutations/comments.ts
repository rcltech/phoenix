import assert from "assert";
import { User, Event, Comment } from "../generated/prisma-client";
import { resolveUserUsingJWT } from "../utils/resolveUser";

const createComment = async (parent, data, ctx): Promise<Comment> => {
  const currentUser: User | null = ctx.auth.user;
  assert.notStrictEqual(currentUser, null, "No user login");

  const userId: string = currentUser.id;
  const content: string = data.content;
  const eventId: string | null = data.eventId;

  if (eventId) {
    return ctx.prisma.createComment({
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
    });
  } else throw new Error("No id of a particular data type is provided");
};

const deleteComment = async (parent, { commentId }, ctx): Promise<Comment> => {
  const currentUser: User | null = ctx.auth.user;
  assert.notStrictEqual(currentUser, null, "No user login");

  const commentUser: User = await ctx.prisma.comment({ id: commentId }).user();
  assert.strictEqual(currentUser.id, commentUser.id, "User is not allowed");

  return ctx.prisma.deleteComment({
    id: commentId,
  });
};

export { createComment, deleteComment };