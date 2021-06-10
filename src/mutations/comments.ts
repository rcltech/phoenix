import { User, Comment } from "@prisma/client";
import { AppContext } from "../context";

const createComment = async (
  parent,
  data,
  ctx: AppContext
): Promise<Comment> => {
  const currentUser: User = ctx.auth.user;

  const userId: string = currentUser.id;
  const content: string = data.content;
  const eventId: string | null = data.eventId;

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
};

const deleteComment = async (
  parent,
  { id },
  ctx: AppContext
): Promise<Comment> => {
  return ctx.prisma.comment.delete({
    where: { id },
  });
};

export { createComment, deleteComment };
