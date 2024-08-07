"use client";
import expense from "@/models/expense";
import category from "@/models/category";
import Dexie from "dexie";

const DB_NAME = "money-database.db";
const DB_VERSION = 3;
const TABLES = [
  { name: "expenses", model: expense },
  { name: "categories", model: category },
];

const db = new Dexie(DB_NAME);
/**
 * @param {string} table name
 * @returns
 */
const Database = (table) => {
  /**
   * @returns {Dexie.Table}
   */
  const open = () => {
    init();
    return db[table];
  };

  const init = () => {
    const open = db.isOpen();
    if (open) return;

    const schema = {};

    for (const { name, model } of TABLES) {
      let indexes = [];
      for (const [key, obj] of Object.entries(model)) {
        const { primaryKey, indexed, unique } = obj;
        if (primaryKey) indexes.push(`++${key}`);
        if (unique) indexes.push(`$${key}`);
        if (indexed) indexes.push(key);
      }
      schema[name] = indexes.join(",");
    }

    try {
      db.version(DB_VERSION).stores(schema);
    } catch (_err) {
      // Database already open
    }
  };

  return { open };
};

export default Database;
