import * as env from "dotenv";
env.config();

import gql from "graphql-tag";
import { GraphQLResponse } from "apollo-server-types";
import { createTestServerWithUserLoggedIn } from "../utils/server";
import { Event, User, Comment } from "../../src/generated/prisma-client";
import { createTestClient } from "apollo-server-testing";
import { createUser, deleteUsers } from "../utils/users";
import {
  createEvent,
  deleteEvents,
  TestEventInfo,
  createEventComment,
  CreateEventCommentInfo,
  retrieveEventComments,
  RetrieveEventCommentsInfo,
} from "../utils/events";

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

describe("event comment creation", () => {
  test("should be able to create a new comment for an event", async () => {
    const testUser: User = await createUser(testUserInfo);
    const testServer = await createTestServerWithUserLoggedIn(testUser);
    // Create a test client connected to the test server
    const client = createTestClient(testServer);
    // Create a test event
    const testEvent: Event = await createEvent(testEventInfo);

    const mutation = gql`
      mutation($eventId: ID!, $content: String!) {
        createComment(eventId: $eventId, content: $content) {
          content
          user {
            id
          }
          event {
            id
          }
        }
      }
    `;

    const {
      data: { createComment },
    }: GraphQLResponse = await client.mutate({
      mutation,
      variables: { eventId: testEvent.id, content: "hello world" },
    });

    expect(createComment).toEqual({
      content: "hello world",
      user: { id: testUser.id },
      event: { id: testEvent.id },
    });
    await deleteEvents();
    await deleteUsers();
  });
});

describe("event comment deletion", () => {
  test("allow users to delete their own comments", async () => {
    // Create user in the database
    const testUser: User = await createUser(testUserInfo);
    const testServer = await createTestServerWithUserLoggedIn(testUser);
    // Create a test client connected to the test server
    const client = createTestClient(testServer);
    // Create a test event
    const testEvent: Event = await createEvent(testEventInfo);
    // Create a test comment
    const eventCommentInfo: CreateEventCommentInfo = {
      event_id: testEvent.id,
      user_id: testUser.id,
      content: "hello world",
    };
    const testComment: Comment = await createEventComment(eventCommentInfo);

    const mutation = gql`
      mutation($id: ID!) {
        deleteComment(id: $id) {
          id
        }
      }
    `;

    const {
      data: { deleteComment },
    }: GraphQLResponse = await client.mutate({
      mutation,
      variables: { id: testComment.id },
    });

    const eventInfo: RetrieveEventCommentsInfo = { event_id: testEvent.id };
    const testEventComments: Comment[] = await retrieveEventComments(eventInfo);
    expect(testEventComments).toEqual([]);

    await deleteEvents();
    await deleteUsers();
  });
});

describe("invalid event comment deletion", () => {
  test("do not allow users to delete other users' comments", async () => {
    // Create first user in the database
    const testUser: User = await createUser(testUserInfo);
    // Create second user in the database
    const testUser1: User = await createUser(testUserInfo1);
    // Create a test server with second user logged in
    const testServer = await createTestServerWithUserLoggedIn(testUser1);
    // Create a test client connected to the test server
    const client = createTestClient(testServer);
    // Create a test event
    const testEvent: Event = await createEvent(testEventInfo);
    // Create a test comment
    const eventCommentInfo: CreateEventCommentInfo = {
      event_id: testEvent.id,
      user_id: testUser.id,
      content: "hello world",
    };
    const testComment: Comment = await createEventComment(eventCommentInfo);

    const mutation = gql`
      mutation($id: ID!) {
        deleteComment(id: $id) {
          id
        }
      }
    `;

    const response: GraphQLResponse = await client.mutate({
      mutation,
      variables: { id: testComment.id },
    });

    expect(response.errors[0].message).toEqual("Not Authorised!");

    await deleteEvents();
    await deleteUsers();
  });
});
