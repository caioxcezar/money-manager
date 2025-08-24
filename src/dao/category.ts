import { type HeaderChange } from "@/components/header";
import { type Category } from "@/contexts/DatabaseContext";
import { type Table } from "dexie";

export type Type = {
  getAll: (order?: HeaderChange) => Promise<Category[]>,
  insert: (description: string) => Promise<Category>,
  update: (id: number, description: string) => Promise<number>,
  delete: (id: number) => Promise<void>
};

const CategoryDao = (table: Table): Type => ({
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
