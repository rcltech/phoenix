import { createUser, deleteUser, login, register } from './mutations/user';
import {user, me} from "./query/user";
import washer from "./query/washer";

const resolvers = {
    Query: {
        user,
        me,
        washer
    },
    Mutation: {
        createUser,
        deleteUser,
        login,
        register
    },
};

export default resolvers;
