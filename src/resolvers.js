module.exports = {
    Query: {
        user: (parent, { id }, { dataSources }, info) =>
            dataSources.users.getUser(id),
        society: async (parent, { id }, { dataSources }, info) => {
            const society = await dataSources.societies.getSociety(id);
            return { society, dataSources };
        },
    },
    User: {
        username: user => user.username,
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
