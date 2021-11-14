import "reflect-metadata";
import gql from "graphql-tag";
import { GraphQLResponse } from "apollo-server-types";
import { createTestServerWithUserLoggedIn } from "../utils/server";
import { Event, User } from "@prisma/client";
import { createTestClient } from "apollo-server-testing";
import { createUser, deleteUsers, TestUserInfo } from "../utils/users";
import {
  createEvent,
  deleteEvents,
  addEventSubscriber,
  TestEventInfo,
  AddEventSubscriberInfo,
} from "../utils/events";

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

afterEach(async () => {
  await deleteEvents();
  await deleteUsers();
});

describe("event subscriber addition", () => {
  test("should be able to add current user to event subscribers list", async () => {
    // Create user in the database
    const testUser: User = await createUser(testUserInfo);
    const testServer = await createTestServerWithUserLoggedIn(testUser);
    // Create a test client connected to the test server
    const client = createTestClient(testServer);
    // Create a test event
    const { id: event_id }: Event = await createEvent(testEventInfo);

    const mutation = gql`
      mutation ($id: ID!) {
        addEventSubscriber(id: $id) {
          subscribers {
            id
          }
        }
      }
    `;

    const {
      data: { addEventSubscriber },
    }: GraphQLResponse = await client.mutate({
      mutation,
      variables: { id: event_id },
    });
    const { subscribers } = addEventSubscriber;
    expect(subscribers).toEqual(expect.arrayContaining([{ id: testUser.id }]));
  });
});

describe("event subscriber removal for subscribed event", () => {
  test("should be able to remove current user from event subscribers list", async () => {
    // Create user in the database
    const testUser: User = await createUser(testUserInfo);
    const testServer = await createTestServerWithUserLoggedIn(testUser);
    // Create a test client connected to the test server
    const client = createTestClient(testServer);
    // Create a test event
    const { id: event_id }: Event = await createEvent(testEventInfo);
    // Add current user to event's subscribers list
    const addEventSubscriberInfo: AddEventSubscriberInfo = {
      event_id,
      user_id: testUser.id,
    };
    await addEventSubscriber(addEventSubscriberInfo);

    const mutation = gql`
      mutation ($id: ID!) {
        removeEventSubscriber(id: $id) {
          subscribers {
            id
          }
        }
      }
    `;

    const {
      data: { removeEventSubscriber },
    }: GraphQLResponse = await client.mutate({
      mutation,
      variables: { id: event_id },
    });
    const { subscribers } = removeEventSubscriber;
    expect(subscribers).toEqual([]);
  });
});

describe("event subscriber removal for non-subscribed event", () => {
  test("should be able to return corresponding event when user wasn't previously subscribed to the event", async () => {
    // Create user in the database
    const testUser: User = await createUser(testUserInfo);
    const testServer = await createTestServerWithUserLoggedIn(testUser);
    // Create a test client connected to the test server
    const client = createTestClient(testServer);
    // Create a test event
    const { id: event_id }: Event = await createEvent(testEventInfo);

    const mutation = gql`
      mutation ($id: ID!) {
        removeEventSubscriber(id: $id) {
          id
        }
      }
    `;

    const {
      data: { removeEventSubscriber },
    }: GraphQLResponse = await client.mutate({
      mutation,
      variables: { id: event_id },
    });

    expect(removeEventSubscriber).toEqual({ id: event_id });
  });
});
