import { createUser, deleteUser } from './mutations/user';
import user from "./query/user";
import washer from "./query/washer";

const resolvers = {
    Query: {
        user,
        washer
    },
    Mutation: {
        createUser,
        deleteUser,
    },
};

export default resolvers;
