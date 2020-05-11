import * as env from "dotenv";
env.config();

import gql from "graphql-tag";
import moment from "moment";
import { createTestServerWithUserLoggedIn } from "./utils/server";
import { Room, User } from "../src/generated/prisma-client";
import { createTestClient } from "apollo-server-testing";
import { createUser, deleteUsers } from "./utils/users";
import { createRoom, deleteRooms } from "./utils/rooms";
import {
  createBooking,
  deleteBookings,
  TestBookingInfo,
} from "./utils/bookings";
import { GraphQLResponse } from "apollo-server-types";

const testUserInfo: User = {
  id: undefined,
  username: "test123",
  email: "test@connect.hku.hk",
  image_url: "http://url",
  phone: "12345678",
  first_name: "Test",
  last_name: "Test",
  room_no: "111A",
  role: "USER",
};

const testUserInfo1: User = {
  id: undefined,
  username: "test234",
  email: "test234@connect.hku.hk",
  image_url: "http://url234",
  phone: "12345678234",
  first_name: "Test",
  last_name: "Test",
  room_no: "234A",
  role: "USER",
};

const testRoomInfo: Room = {
  id: "",
  number: "123",
  name: "test",
};

const testBookingInfo: TestBookingInfo = {
  user: "test123",
  room: "123",
  start: moment()
    .startOf("hour")
    .toDate(),
  end: moment()
    .startOf("hour")
    .add(2, "hour")
    .toDate(),
  remark: "Hello",
};

const testInvalidBookingVariables = {
  room_number: "123",
  start: moment()
    .startOf("hour")
    .add(1, "hour")
    .toISOString(),
  end: moment()
    .startOf("hour")
    .add(2, "hour")
    .toISOString(),
  remark: "Hi",
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
    // Create the required rooms
    await createRoom(testRoomInfo);
    // Create a booking
    await createBooking(testBookingInfo);
    const query = gql`
      query {
        bookings {
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
      }
    `;
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

describe("Booking validation", () => {
  test("can validate bookings", async () => {
    // Create user in the database
    const user: User = await createUser(testUserInfo);
    const testServer = await createTestServerWithUserLoggedIn(user);
    // Create a test client connected to the test server
    const client = createTestClient(testServer);
    // Create the required rooms
    await createRoom(testRoomInfo);
    // Create a booking
    await createBooking(testBookingInfo);

    // Attempt to create an invalid booking
    const mutation = gql`
      mutation(
        $room_number: String!
        $start: String!
        $end: String!
        $remark: String
      ) {
        createBooking(
          room_number: $room_number
          start: $start
          end: $end
          remark: $remark
        ) {
          id
        }
      }
    `;
    const result: GraphQLResponse = await client.mutate({
      mutation,
      variables: testInvalidBookingVariables,
    });
    expect(result.data).toEqual({ createBooking: null });

    await deleteBookings();
    await deleteRooms();
    await deleteUsers();
  });
});

describe("Booking mutations", () => {
  test("allows users to update their own bookings", async () => {
    const user: User = await createUser(testUserInfo);
    const testServer = await createTestServerWithUserLoggedIn(user);
    // Create a test client connected to the test server
    const client = createTestClient(testServer);
    await createRoom(testRoomInfo);
    const booking = await createBooking(testBookingInfo);
    const mutation = gql`
      mutation(
        $id: ID!
        $room: String!
        $start: String!
        $end: String!
        $remark: String
      ) {
        updateBooking(
          id: $id
          room_number: $room
          start: $start
          end: $end
          remark: $remark
        ) {
          id
          remark
        }
      }
    `;
    const testUpdatedBookingInfo = {
      id: booking.id,
      user: "test123",
      room: "123",
      start: booking.start,
      end: booking.end,
      remark: "HelloWorld",
    };
    const result: GraphQLResponse = await client.mutate({
      mutation,
      variables: testUpdatedBookingInfo,
    });
    expect(result.data).toEqual({
      updateBooking: {
        id: booking.id,
        remark: testUpdatedBookingInfo.remark,
      },
    });
    await deleteBookings();
    await deleteRooms();
    await deleteUsers();
  });

  test("do not allow to change other user's bookings", async () => {
    const user: User = await createUser(testUserInfo);
    const testServer = await createTestServerWithUserLoggedIn(user);
    // Create a test client connected to the test server
    const client = createTestClient(testServer);
    await createRoom(testRoomInfo);
    const booking = await createBooking(testBookingInfo);
    const user1: User = await createUser(testUserInfo1);
    const testServer1 = await createTestServerWithUserLoggedIn(user1);
    const client1 = createTestClient(testServer1);

    const mutation = gql`
      mutation(
        $id: ID!
        $room: String!
        $start: String!
        $end: String!
        $remark: String
      ) {
        updateBooking(
          id: $id
          room_number: $room
          start: $start
          end: $end
          remark: $remark
        ) {
          id
        }
      }
    `;
    const testUpdatedBookingInfo = {
      id: booking.id,
      user: "test123",
      room: "123",
      start: booking.start,
      end: booking.end,
      remark: "HelloWorld",
    };

    const result: GraphQLResponse = await client1.mutate({
      mutation,
      variables: testUpdatedBookingInfo,
    });
    expect(result.errors[0].message).toEqual("Not Authorised!");
    await deleteBookings();
    await deleteRooms();
    await deleteUsers();
  });

  test("allow users to delete their own bookings", async () => {
    const user: User = await createUser(testUserInfo);
    const testServer = await createTestServerWithUserLoggedIn(user);
    // Create a test client connected to the test server
    const client = createTestClient(testServer);
    await createRoom(testRoomInfo);
    const booking = await createBooking(testBookingInfo);
    const mutation = gql`
      mutation($id: ID!) {
        deleteBooking(id: $id) {
          id
        }
      }
    `;
    const result = await client.mutate({
      mutation,
      variables: { id: booking.id },
    });
    expect(result.data).toEqual({
      deleteBooking: {
        id: booking.id,
      },
    });
    await deleteBookings();
    await deleteRooms();
    await deleteUsers();
  });

  test("do not allow users to delete other user's own bookings", async () => {
    const user: User = await createUser(testUserInfo);
    const testServer = await createTestServerWithUserLoggedIn(user);
    // Create a test client connected to the test server
    const client = createTestClient(testServer);
    await createRoom(testRoomInfo);
    const booking = await createBooking(testBookingInfo);
    const user1: User = await createUser(testUserInfo1);
    const testServer1 = await createTestServerWithUserLoggedIn(user1);
    const client1 = createTestClient(testServer1);
    const mutation = gql`
      mutation($id: ID!) {
        deleteBooking(id: $id) {
          id
        }
      }
    `;

    const result: GraphQLResponse = await client1.mutate({
      mutation,
      variables: { id: booking.id },
    });
    expect(result.errors[0].message).toEqual("Not Authorised!");
    await deleteBookings();
    await deleteRooms();
    await deleteUsers();
  });
});
