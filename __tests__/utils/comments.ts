import { PrismaClient, Comment } from "@prisma/client";

const prisma = new PrismaClient();

export const deleteComment = (comment_id: string): Promise<Comment> =>
  prisma.comment.delete({ where: { id: comment_id } });

export const deleteComments = async (): Promise<void> => {
  await prisma.comment.deleteMany({});
};
