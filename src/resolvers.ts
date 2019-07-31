const resolvers = {
    Query: {
        user: (parent, { id }, { dataSources }, info) =>
            dataSources.users.getUser(id),
        society: async (parent, { id }, { dataSources }, info) => {
            const society = await dataSources.societies.getSociety(id);
            return { society, dataSources };
        },
    },

    Mutation: {
        addUser: (parent, { newUser }, { dataSources }, info) => dataSources.users.addUser(newUser),
    },

    User: {
        username: user => user.username,
        email: user => user.email,
        imageUrl: user => user.imageUrl,
        phone: user => user.phone,
        firstname: user => user.firstname,
        lastname: user => user.lastname,
        roomno: user => user.roomno,
    },
    Society: {
        name: ({ society, dataSources }) => society.name,
        members: ({ society, dataSources }) =>
            dataSources.societies.getSocietyMembers(society, dataSources),
    },
};

export default resolvers;