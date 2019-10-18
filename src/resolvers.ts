import { createUser, deleteUser, login, register } from './mutations/user';
import {user, me} from "./query/user";
import washer from "./query/washer";
import {bookings, rooms} from "./query/bookings";
import {createBooking} from "./mutations/bookings";

const resolvers = {
    Query: {
        user,
        me,
        washer,
        bookings,
        rooms
    },
    Mutation: {
        createUser,
        deleteUser,
        login,
        register,
        createBooking
    },
    Booking: {
        room(parent, _ , ctx){
            return ctx.prisma.booking({id: parent.id}).room()
        },
        user(parent, _ , ctx){
            return ctx.prisma.booking({id: parent.id}).user()
        },
    }
};

export default resolvers;
