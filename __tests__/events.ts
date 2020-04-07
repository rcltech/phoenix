import * as env from "dotenv";
import gql from "graphql-tag";
import { GraphQLResponse } from "apollo-server-types";
import { createTestServerWithUserLoggedIn } from "./utils/server";
import { User } from "../src/generated/prisma-client";
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
    // Create the test event
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

describe("event mutation", () => {
  test("should be able to create an event", async () => {
    // Create user in the database
    const user: User = await createUser(testUserInfo);
    const testServer = await createTestServerWithUserLoggedIn(user);
    // Create a test client connected to the test server
    const client = createTestClient(testServer);

    const createMutation = gql`
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
    const response: GraphQLResponse = await client.mutate({
      mutation: createMutation,
      variables: { ...testEventInfo, image_base64: "" },
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

  test("should be able to delete an event", async () => {
    // Create user in the database
    const user: User = await createUser(testUserInfo);
    const testServer = await createTestServerWithUserLoggedIn(user);
    // Create a test client connected to the test server
    const client = createTestClient(testServer);
  });
});
