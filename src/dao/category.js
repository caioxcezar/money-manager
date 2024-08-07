import Database from "./database";

const db = Database("categories");

const CategoryDao = {
  getAll: async (order) => {
    let collection = db.open();
    if (order) {
      collection = collection.orderBy(order.column);
      if (order.direction == "prev") collection = collection.reverse();
    }
    return collection.toArray();
  },
  insert: async (description) => db.open().add({ description }),
  update: async (id, description) => db.open().update(id, { description }),
  delete: async (id) => db.open().delete(id),
};

export default CategoryDao;
