import "reflect-metadata";
import gql from "graphql-tag";
import moment from "moment";
import { createTestServerWithUserLoggedIn } from "./utils/server";
import { User } from "@prisma/client";
import { createTestClient } from "apollo-server-testing";
import { createUser, deleteUsers, TestUserInfo } from "./utils/users";
import { createRoom, deleteRooms, TestRoomInfo } from "./utils/rooms";
import {
  createBooking,
  deleteBookings,
  TestBookingInfo,
} from "./utils/bookings";
import { GraphQLResponse } from "apollo-server-types";

const testUserInfo: TestUserInfo = {
  username: "test123",
  email: "test@connect.hku.hk",
  image_url: "http://url",
  phone: "12345678",
  first_name: "Test",
  last_name: "Test",
  room_no: "111A",
  role: "USER",
};

const testUserInfo1: TestUserInfo = {
  username: "test234",
  email: "test234@connect.hku.hk",
  image_url: "http://url234",
  phone: "12345678234",
  first_name: "Test",
  last_name: "Test",
  room_no: "234A",
  role: "USER",
};

const testRoomInfo: TestRoomInfo = {
  number: "123",
  name: "test",
};

const testBookingInfo: TestBookingInfo = {
  user: "test123",
  room: testRoomInfo.number,
  start: moment().startOf("hour").add(1, "hour").toDate(),
  end: moment().startOf("hour").add(3, "hour").toDate(),
  remark: "Hello",
};

const testInvalidBookingVariables = {
  room_number: testRoomInfo.number,
  start: moment().startOf("hour").add(2, "hour").toISOString(),
  end: moment().startOf("hour").add(3, "hour").toISOString(),
  remark: "Hi",
};

beforeAll(async () => {
  await deleteBookings();
  await deleteRooms();
  await deleteUsers();
});

afterEach(async () => {
  await deleteBookings();
  await deleteRooms();
  await deleteUsers();
});

describe("Booking queries", () => {
  test("can query all bookings", async () => {
    // Create user in the database
    const user: User = await createUser(testUserInfo);
    const testServer = await createTestServerWithUserLoggedIn(user);
    // Create a test client connected to the test server
    const client = createTestClient(testServer);

    // Create the required rooms
    const room = await createRoom(testRoomInfo);
    // Create a booking
    const booking = await createBooking(testBookingInfo);

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

    const response: GraphQLResponse = await client.query({ query });

    expect(response.data).toEqual({
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
    const room = await createRoom(testRoomInfo);
    // Create a booking
    const booking = await createBooking(testBookingInfo);

    // Attempt to create an invalid booking
    const mutation = gql`
      mutation (
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
    const response: GraphQLResponse = await client.mutate({
      mutation,
      variables: testInvalidBookingVariables,
    });

    expect(response.errors[0].message).toBeDefined();
  });
});

describe("Booking mutations", () => {
  test("allows users to update their own bookings", async () => {
    const user: User = await createUser(testUserInfo);
    const testServer = await createTestServerWithUserLoggedIn(user);
    // Create a test client connected to the test server
    const client = createTestClient(testServer);
    const room = await createRoom(testRoomInfo);
    const booking = await createBooking(testBookingInfo);
    const mutation = gql`
      mutation (
        $id: ID!
        $room: String
        $start: String
        $end: String
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
  });

  test("do not allow to change other user's bookings", async () => {
    const user: User = await createUser(testUserInfo);
    // Create a test client connected to the test server
    const room = await createRoom(testRoomInfo);
    const booking = await createBooking(testBookingInfo);
    const user1: User = await createUser(testUserInfo1);
    const testServer1 = await createTestServerWithUserLoggedIn(user1);
    const client1 = createTestClient(testServer1);

    const mutation = gql`
      mutation (
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
      room: "123",
      start: booking.start.toISOString(),
      end: booking.end.toString(),
      remark: "HelloWorld",
    };

    const result: GraphQLResponse = await client1.mutate({
      mutation,
      variables: testUpdatedBookingInfo,
    });
    expect(result.errors[0].message).toBeDefined();
  });

  test("allow users to delete their own bookings", async () => {
    const user: User = await createUser(testUserInfo);
    const testServer = await createTestServerWithUserLoggedIn(user);
    // Create a test client connected to the test server
    const client = createTestClient(testServer);
    const room = await createRoom(testRoomInfo);
    const booking = await createBooking(testBookingInfo);
    const mutation = gql`
      mutation ($id: ID!) {
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
  });

  test("do not allow users to delete other user's own bookings", async () => {
    const user: User = await createUser(testUserInfo);
    const room = await createRoom(testRoomInfo);
    const booking = await createBooking(testBookingInfo);
    const user1: User = await createUser(testUserInfo1);
    const testServer1 = await createTestServerWithUserLoggedIn(user1);
    const client1 = createTestClient(testServer1);
    const mutation = gql`
      mutation ($id: ID!) {
        deleteBooking(id: $id) {
          id
        }
      }
    `;

    const result: GraphQLResponse = await client1.mutate({
      mutation,
      variables: { id: booking.id },
    });
    expect(result.errors[0].message).toBeDefined();
  });
});
