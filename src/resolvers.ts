const resolvers = {
    Query: {
        user: (parent, { username }, ctx) => ctx.prisma.user({
            username
        }),
        washer: (parent, { id }, ctx) => ctx.prisma.washer({
            id
        }),
    },

    Mutation: {
        createUser: (parent, { username, email, image_url, phone, first_name, last_name, room_no} , ctx) =>
            ctx.prisma.createUser({username, email, image_url, phone, first_name, last_name, room_no}),

    }
};

export default resolvers;