import Database from "./database";

const db = Database("expenses");

const ExpenseDao = {
  countBy: (column, key) => db.open().where(column).equals(key).count(),
  getAll: async (order, range) => {
    const table = db.open();
    const list = range
      ? await table
          .where(range.column)
          .between(range.lower, range.upper, range.lowerOpen, range.upperOpen)
          .toArray()
      : await table.toArray();
    return order
      ? list.sort((a, b) => sort[order.direction](a, b, order.column))
      : list;
  },
  delete: async (id) => db.open().delete(id),
  insert: async (description, category, date, value) =>
    db.open().add({ description, category, date, value }),
  bulkInsert: async (itens) => db.open().bulkAdd(itens),
  update: async (id, description, category, date, value) =>
    db.open().update(id, { description, category, date, value }),
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
