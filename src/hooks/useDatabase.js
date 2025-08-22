import { useContext, useMemo } from "react";
import { DatabaseContext } from "@/contexts/DatabaseContext";
import CategoryDao from "@/dao/category";
import ExpenseDao from "@/dao/expense";

const useDatabase = () => {
  const context = useContext(DatabaseContext);

  /** @type {import('dexie').Dexie} */
  const db = context.db;

  const init = () => context.init();

  /**
   * Open the database and returns the table
   * @param {String} table name
   * @returns {Dexie.Table}
   */
  const open = (table) => context.open(table);

  const expenses = useMemo(() => ExpenseDao(open("expenses")), [context]);
  const categories = useMemo(() => CategoryDao(open("categories")), [context]);

  return { open, db, init, expenses, categories };
};

export default useDatabase;
