import * as env from "dotenv";
import gql from "graphql-tag";
import { GraphQLResponse } from "apollo-server-types";
import { createTestServerWithUserLoggedIn } from "./utils/server";
import { Event, User } from "../src/generated/prisma-client";
import { createTestClient } from "apollo-server-testing";
import { createUser, deleteUsers } from "./utils/users";
import { createEvent, deleteEvents, TestEventInfo } from "./utils/events";

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

const testEventInfo: TestEventInfo = {
  title: "test event",
  organiser: testUserInfo.username,
  start: new Date(),
  end: new Date(),
  venue: "test venue",
  image_url: "http://url",
  description: "test description",
};

beforeAll(async () => await deleteUsers());

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
          start: testEventInfo.start.toISOString(),
          end: testEventInfo.end.toISOString(),
          venue: testEventInfo.venue,
          image_url: testEventInfo.image_url,
          description: testEventInfo.description,
        },
      ],
    });

    await deleteEvents();
    await deleteUsers();
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
      mutation(
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
        start: testEventInfo.start.toISOString(),
        end: testEventInfo.end.toISOString(),
        venue: testEventInfo.venue,
        image_url: "",
        description: testEventInfo.description,
      },
    });

    await deleteEvents();
    await deleteUsers();
  });
});

describe("event deletion", () => {
  test("should be able to delete an event", async () => {
    // Create user in the database
    const user: User = await createUser(testUserInfo);
    const testServer = await createTestServerWithUserLoggedIn(user);
    // Create a test client connected to the test server
    const client = createTestClient(testServer);
    // Create a test event
    const event: Event = await createEvent(testEventInfo);

    const mutation = gql`
      mutation($id: ID!) {
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

    await deleteEvents();
    await deleteUsers();
  });
});

describe("event subscriber addition and removal", () => {
  test("should be able to add/remove current user to/from event subscribers list", async () => {
    // Create user in the database
    const testUser: User = await createUser(testUserInfo);
    const testServer = await createTestServerWithUserLoggedIn(testUser);
    // Create a test client connected to the test server
    const client = createTestClient(testServer);
    // Create a test event
    const { id: event_id }: Event = await createEvent(testEventInfo);

    const addSubscriberMutation = gql`
      mutation($id: ID!) {
        addEventSubscriber(id: $id) {
          subscribers {
            id
          }
        }
      }
    `;

    const removeSubscriberMutation = gql`
      mutation($id: ID!) {
        removeEventSubscriber(id: $id) {
          subscribers {
            id
          }
        }
      }
    `;

    const {
      data: { addEventSubscriber },
    }: GraphQLResponse = await client.mutate({
      mutation: addSubscriberMutation,
      variables: { id: event_id },
    });
    const { subscribers: filledSubscribers } = addEventSubscriber;
    expect(filledSubscribers).toEqual(
      expect.arrayContaining([{ id: testUser.id }])
    );

    const {
      data: { removeEventSubscriber },
    }: GraphQLResponse = await client.mutate({
      mutation: removeSubscriberMutation,
      variables: { id: event_id },
    });
    const { subscribers: emptySubscribers } = removeEventSubscriber;
    expect(emptySubscribers).toEqual([]);

    await deleteEvents();
    await deleteUsers();
  });
});
