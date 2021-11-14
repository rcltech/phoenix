import "reflect-metadata";
import gql from "graphql-tag";
import moment from "moment";
import { GraphQLResponse } from "apollo-server-types";
import { createTestServerWithUserLoggedIn } from "../utils/server";
import { Event, User } from "@prisma/client";
import { createTestClient } from "apollo-server-testing";
import { createUser, deleteUsers, TestUserInfo } from "../utils/users";
import { createEvent, deleteEvents, TestEventInfo } from "../utils/events";

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

const testEventInfo: TestEventInfo = {
  title: "test event",
  organiser: testUserInfo.username,
  start: moment().startOf("hour").add(1, "hour").toDate(),
  end: moment().startOf("hour").add(2, "hour").toDate(),
  venue: "test venue",
  image_url: "http://url",
  description: "test description",
};

beforeAll(async () => await deleteUsers());

afterEach(async () => {
  await deleteEvents();
  await deleteUsers();
});

describe("event queries", () => {
  test("should return a list of events", async () => {
    // Create user in the database
    const user: User = await createUser(testUserInfo);
    const testServer = await createTestServerWithUserLoggedIn(user);
    // Create a test client connected to the test server
    const client = createTestClient(testServer);
    // Create a test event
    await createEvent(testEventInfo);

    // query for the test event
    const query = gql`
      query {
        events {
          title
          organiser {
            username
          }
          start
          end
          venue
          image_url
          description
        }
      }
    `;
    const response: GraphQLResponse = await client.query({ query });
    expect(response.data).toEqual({
      events: [
        {
          title: testEventInfo.title,
          organiser: {
            username: testUserInfo.username,
          },
          start: testEventInfo.start,
          end: testEventInfo.end,
          venue: testEventInfo.venue,
          image_url: testEventInfo.image_url,
          description: testEventInfo.description,
        },
      ],
    });
  });
});

describe("event creation", () => {
  test("should be able to create an event", async () => {
    // Create user in the database
    const user: User = await createUser(testUserInfo);
    const testServer = await createTestServerWithUserLoggedIn(user);
    // Create a test client connected to the test server
    const client = createTestClient(testServer);

    const mutation = gql`
      mutation (
        $title: String!
        $start: String!
        $end: String!
        $venue: String!
        $image_base64: String!
        $description: String
      ) {
        createEvent(
          title: $title
          start: $start
          end: $end
          venue: $venue
          image_base64: $image_base64
          description: $description
        ) {
          title
          organiser {
            username
          }
          start
          end
          venue
          image_url
          description
        }
      }
    `;
    const variables = {
      title: testEventInfo.title,
      start: testEventInfo.start.toISOString(),
      end: testEventInfo.end.toISOString(),
      venue: testEventInfo.venue,
      image_base64: "",
      description: testEventInfo.description,
    };
    const response: GraphQLResponse = await client.mutate({
      mutation,
      variables,
    });

    expect(response.data).toEqual({
      createEvent: {
        title: testEventInfo.title,
        organiser: {
          username: testUserInfo.username,
        },
        start: testEventInfo.start,
        end: testEventInfo.end,
        venue: testEventInfo.venue,
        image_url: "",
        description: testEventInfo.description,
      },
    });
  });
});

describe("event deletion", () => {
  test("allow users to delete their own events", async () => {
    // Create user in the database
    const user: User = await createUser(testUserInfo);
    const testServer = await createTestServerWithUserLoggedIn(user);
    // Create a test client connected to the test server
    const client = createTestClient(testServer);
    // Create a test event
    const event: Event = await createEvent(testEventInfo);

    const mutation = gql`
      mutation ($id: ID!) {
        deleteEvent(id: $id) {
          id
        }
      }
    `;
    const response: GraphQLResponse = await client.mutate({
      mutation,
      variables: { id: event.id },
    });
    expect(response.data).toEqual({
      deleteEvent: {
        id: event.id,
      },
    });
  });
});

describe("invalid event deletion", () => {
  test("do not allow users to delete other users' events", async () => {
    // Create the first user in the database
    const user: User = await createUser(testUserInfo);
    // Create the second user in the database
    const user1: User = await createUser(testUserInfo1);
    // Create a test server with second user logged in
    const testServer = await createTestServerWithUserLoggedIn(user1);
    // Create a test client connected to the test server
    const client = createTestClient(testServer);
    // Create a test event with the first user as organiser
    const event: Event = await createEvent(testEventInfo);

    const mutation = gql`
      mutation ($id: ID!) {
        deleteEvent(id: $id) {
          id
        }
      }
    `;
    const response: GraphQLResponse = await client.mutate({
      mutation,
      variables: { id: event.id },
    });
    expect(response.errors[0].message).toEqual("Not Authorised!");
  });
});
