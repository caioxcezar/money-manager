import Database from "./database";

const db = Database("categories");

const CategoryDao = {
  getAll: async (sortedBy) =>
    sortedBy ? db.getAll(sortedBy) : db.getAllById(),
  getRange: async (order, range) =>
    db.getRange(order.title, range, order.order),
  insert: async (description) => db.put({ description }),
  update: async (id, description) => db.put({ id, description }),
  delete: async (id) => db.remove(id),
};

export default CategoryDao;
