import { Comment } from "@prisma/client";
import { setupPrismaForTesting } from "./setupPrismaForTesting";

const prisma = setupPrismaForTesting();

export const deleteComment = (comment_id: string): Promise<Comment> =>
  prisma.comment.delete({ where: { id: comment_id } });

export const deleteComments = async (): Promise<void> => {
  await prisma.comment.deleteMany({});
};
