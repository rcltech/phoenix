import * as env from "dotenv";
import { PrismaClient, Event, Comment } from "@prisma/client";

env.config();

const prisma = new PrismaClient();

export type TestEventInfo = {
  title: string;
  organiser: string;
  start: Date;
  end: Date;
  venue: string;
  image_url: string;
  description: string;
};

export type AddEventSubscriberInfo = {
  event_id: string;
  user_id: string;
};

export type CreateEventCommentInfo = {
  event_id: string;
  user_id: string;
  content: string;
};

export type RetrieveEventCommentsInfo = {
  event_id: string;
};

export const createEvent = ({
  title,
  organiser,
  start,
  end,
  venue,
  image_url,
  description,
}: TestEventInfo): Promise<Event> => {
  return prisma.event.create({
    data: {
      title,
      start: new Date(start),
      end: new Date(end),
      venue,
      image_url,
      description,
      organiser: {
        connect: {
          username: organiser,
        },
      },
    },
  });
};

export const deleteEvents = async (): Promise<void> => {
  await prisma.event.deleteMany({});
};

export const addEventSubscriber = ({
  event_id,
  user_id,
}: AddEventSubscriberInfo): Promise<Event> => {
  return prisma.event.update({
    where: { id: event_id },
    data: {
      subscribers: {
        connect: { id: user_id },
      },
    },
  });
};

export const createEventComment = ({
  event_id,
  user_id,
  content,
}: CreateEventCommentInfo): Promise<Comment> => {
  return prisma.comment.create({
    data: {
      content,
      user: {
        connect: { id: user_id },
      },
      event: {
        connect: { id: event_id },
      },
    },
  });
};

export const retrieveEventComments = ({
  event_id,
}: RetrieveEventCommentsInfo): Promise<Comment[]> => {
  return prisma.event.findUnique({ where: { id: event_id } }).comments();
};
