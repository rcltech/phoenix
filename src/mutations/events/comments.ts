import assert from "assert";
import { User, Event, Comment } from "../../generated/prisma-client";
import { resolveUserUsingJWT } from "../../utils/resolveUser";

const createEventComment = async (parent, data, ctx): Promise<Comment> => {
  const currentUser: User | null = await resolveUserUsingJWT(ctx);
  assert.notStrictEqual(currentUser, null, "No user login");

  const userId: string = currentUser.id;
  const eventId: string = data.id;
  const content: string = data.content;

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
};

const deleteEventComment = async (parent, { id }, ctx): Promise<Comment> => {
  const currentUser: User | null = await resolveUserUsingJWT(ctx);
  assert.notStrictEqual(currentUser, null, "No user login");

  const commentUser: User = await ctx.prisma.comment({ id }).user();
  assert.strictEqual(currentUser.id, commentUser.id, "User is not allowed");

  return ctx.prisma.deleteComment({
    id,
  });
};

export { createEventComment, deleteEventComment };
