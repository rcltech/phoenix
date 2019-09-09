const resolvers = {
    Query: {
        user: (parent, { username }, ctx) => ctx.prisma.user({
            username
        }),
        washer: (parent, { id }, ctx) => ctx.prisma.washer({
            id
        }),
        society: (parent, {name}, ctx) => ctx.prisma.society({
            name: name,
        })
    },

    Society: {
        members: (parent, {name}, ctx) => ctx.prisma.society({name: parent.name}).members()
    },

    Mutation: {
        createUser: (parent, { username, email, image_url, phone, first_name, last_name, room_no} , ctx) =>
            ctx.prisma.createUser({username, email, image_url, phone, first_name, last_name, room_no}),
        createSociety: (parent, {name, members}, ctx) => {
            const allUsers = members.map(user => ({username: user}));
            return ctx.prisma.createSociety({
                name,
                members: {
                    connect: allUsers
                }
            })
        },
    }
};

export default resolvers;