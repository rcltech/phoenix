import * as env from "dotenv";
import { createTestServerWithUserLoggedIn } from "./utils/server";
import { Room, User } from "../src/generated/prisma-client";
import { createTestClient } from "apollo-server-testing";
import { createUser, deleteUsers } from "./utils/users";
import { createRoom, deleteRooms } from "./utils/rooms";
import { createBooking, deleteBookings } from "./utils/bookings";
import { GraphQLResponse } from "apollo-server-types";

env.config();

const testUserInfo: User = {
  id: undefined,
  username: "test123",
  email: "test@connect.hku.hk",
  image_url: "http://url",
  phone: "12345678",
  first_name: "Test",
  last_name: "Test",
  room_no: "111A",
};

const testRoomInfo: Room = {
  id: "",
  number: "123",
  name: "test",
};

const testBookingInfo = {
  user: "test123",
  room: "123",
  start: new Date(),
  end: new Date(),
  remark: "Hello",
};

beforeAll(async () => await deleteUsers());

describe("Booking queries", () => {
  test("can query all bookings", async () => {
    await deleteRooms();

    // Create user in the database
    const user: User = await createUser(testUserInfo);
    const testServer = await createTestServerWithUserLoggedIn(user);
    // Create a test client connected to the test server
    const client = createTestClient(testServer);
    //Create the required rooms
    await createRoom(testRoomInfo);
    // Create a test client connected to the test server
    // Create a booking
    await createBooking(testBookingInfo);
    const query = `{
      bookings{
        user {
          username
        }
        room {
          number
        }
        start
        end
        remark
      }
    }`;
    const result: GraphQLResponse = await client.query({ query });
    expect(result.data).toEqual({
      bookings: [
        {
          user: {
            username: testUserInfo.username,
          },
          room: {
            number: testRoomInfo.number,
          },
          start: testBookingInfo.start.toISOString(),
          end: testBookingInfo.end.toISOString(),
          remark: testBookingInfo.remark,
        },
      ],
    });
    await deleteBookings();
    await deleteRooms();
    await deleteUsers();
  });
});
