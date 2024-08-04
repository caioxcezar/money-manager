import { DateTime } from "luxon";

export const toMillis = (date) => DateTime.fromISO(date).toMillis();

export const fromString = (date) => DateTime.fromISO(date);

export const fromMillis = (date) =>
  DateTime.fromMillis(date).toISO().slice(0, 16);
