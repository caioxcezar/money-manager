import { DateTime } from "luxon";

export const toMillis = (date: string) => DateTime.fromISO(date).toMillis();

export const fromString = (date: string) => DateTime.fromISO(date);

export const fromMillis = (date: number) =>
  DateTime.fromMillis(date).toISO()!.slice(0, 16);

export const fromMillisToDate = (date: number) => DateTime.fromMillis(date);

export const now = () => DateTime.now();
