const washer = (parent, { id }, ctx) =>
  ctx.prisma.washer({
    id,
  });

export default washer;
