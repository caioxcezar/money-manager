import Database from "./database";

const db = Database("expenses");

const ExpenseDao = {
  delete: async (id) => db.remove(id),
  getOneByCategory: async (id) => db.getOne("category", id),
  getAll: async (sortedBy) =>
    sortedBy ? db.getAll(sortedBy) : db.getAllById(),
  getRange: async (order, range) =>
    db.getRange(order.title, range, order.order),
  insert: async (description, category, date, value) =>
    db.put({ description, category, date, value }),
  update: async (id, description, category, date, value) =>
    db.put({ id, description, category, date, value }),
};

export default ExpenseDao;
