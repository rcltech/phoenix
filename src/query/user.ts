const user = (parent, { username }, ctx) =>
    ctx.prisma.user({
        username,
    });

export default user;