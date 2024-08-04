import { DateTime } from "luxon";
import Database from "./database";

const db = Database("expenses");

const ExpenseDao = {
  get: async () => db.getLast(),
  insert: async (startDay) =>
    db.put({ startDay, insertDate: DateTime.now().toMillis() }),
};

export default ExpenseDao;
