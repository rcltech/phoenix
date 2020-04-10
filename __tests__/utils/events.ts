import * as env from "dotenv";
import {
  BatchPayloadPromise,
  Event,
  prisma,
} from "../../src/generated/prisma-client";

env.config();

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

export const createEvent = ({
  title,
  organiser,
  start,
  end,
  venue,
  image_url,
  description,
}: TestEventInfo): Promise<Event> => {
  return prisma.createEvent({
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
  });
};

export const deleteEvents = (): BatchPayloadPromise => {
  return prisma.deleteManyEvents({});
};

export const addEventSubscriber = ({
  event_id,
  user_id,
}: AddEventSubscriberInfo): Promise<Event> => {
  return prisma.updateEvent({
    where: { id: event_id },
    data: {
      subscribers: {
        connect: { id: user_id },
      },
    },
  });
};
