import Database from "./database";

const db = Database("expenses");

const ExpenseDao = {
  delete: async (id) => db.remove(id),
  getOneByCategory: async (id) => db.getOne("category", id),
  getAll: async (sortedBy) =>
    sortedBy ? db.getAll(sortedBy) : db.getAllById(),
  getRange: async (order, range) => {
    const list = await db.getRange("date", range, "next");
    return list.sort((a, b) => sort[order.order](a, b, order.title));
  },
  insert: async (description, category, date, value) =>
    db.put({ description, category, date, value }),
  update: async (id, description, category, date, value) =>
    db.put({ id, description, category, date, value }),
};

const sort = {
  next: (a, b, prop) => _sort(b[prop], a[prop]),
  prev: (a, b, prop) => _sort(a[prop], b[prop]),
};

const _sort = (a, b) => {
  if (a > b) return -1;
  if (b > a) return 1;
  return 0;
};

export default ExpenseDao;
