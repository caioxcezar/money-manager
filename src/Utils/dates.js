import { DateTime } from "luxon";

/**
 *
 * @param {String} date
 * @returns {Number}
 */
export const toMillis = (date) => DateTime.fromISO(date).toMillis();

/**
 *
 * @param {String} date
 * @returns {DateTime}
 */
export const fromString = (date) => DateTime.fromISO(date);

/**
 *
 * @param {Number} date
 * @returns {String}
 */
export const fromMillis = (date) =>
  DateTime.fromMillis(date).toISO().slice(0, 16);

/**
 *
 * @returns {DateTime}
 */
export const now = () => DateTime.now();
