const CategoryDao = (table) => ({
  getAll: async (order) => {
    if (order) {
      let collection = table.orderBy(order.column);
      if (order.direction == "prev") collection = collection.reverse();
      return collection.toArray();
    } else {
      return table.toArray();
    }
  },
  insert: async (description) => table.add({ description }),
  update: async (id, description) => table.update(id, { description }),
  delete: async (id) => table.delete(id),
});

export default CategoryDao;
