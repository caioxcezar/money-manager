"use client";
import React, { createContext, useRef } from "react";
import Dexie, { type EntityTable, type Table } from "dexie";

const DB_NAME = "money-database.db";
const DB_VERSION = 3;

type Props = {
  open: (table: "expenses" | "categories" | "income") => Table;
  db: DataBase;
  init: () => void;
};

export type Category = {
  id: number;
  description: string;
};

export type Expense = {
  id: number;
  description: string;
  category: number;
  date: number;
  value: number;
};

export type Income = {
  id: number;
  description: string;
  date: number;
  value: number;
};

export type Range = {
  column: string;
  lower: string | number;
  upper: string | number;
  lowerOpen?: boolean | undefined;
  upperOpen?: boolean;
};

type DataBase = Dexie & {
  categories: EntityTable<Category, "id">;
  expenses: EntityTable<Expense, "id">;
  income: EntityTable<Income, "id">;
};

export const DatabaseContext = createContext<Props | undefined>(undefined);

const DatabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const db: DataBase = useRef(new Dexie(DB_NAME) as DataBase).current;

  const open = (table: "expenses" | "categories" | "income"): Table => {
    init();
    return db[table];
  };

  const init = () => {
    const open = db!.isOpen();
    if (open) return;

    const schema = {
      categories: "++id, description",
      expenses: "++id, description, category, date, value",
      income: "++id, description, date, value",
    };

    try {
      db!.version(DB_VERSION).stores(schema);
      db!.open();
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

export default DatabaseProvider;
