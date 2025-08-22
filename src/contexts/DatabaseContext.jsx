"use client";
import React, { createContext, useRef } from "react";
import expense from "@/models/expense";
import category from "@/models/category";
import Dexie from "dexie";
import propTypes from "prop-types";

const DB_NAME = "money-database.db";
const DB_VERSION = 3;
const TABLES = [
  { name: "expenses", model: expense },
  { name: "categories", model: category },
];

export const DatabaseContext = createContext();

const DatabaseProvider = ({ children }) => {
  const db = useRef(new Dexie(DB_NAME)).current;

  const open = (table) => {
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
      db.open();
    } catch (_err) {
      // Database already open
    }
  };

  return (
    <DatabaseContext.Provider value={{ open, db, init }}>
      {children}
    </DatabaseContext.Provider>
  );
};

DatabaseProvider.propTypes = {
  children: propTypes.element,
};

export default DatabaseProvider;
