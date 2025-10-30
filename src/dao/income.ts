import { type HeaderChange } from "@/components/header";
import { type Range, type Income } from "@/contexts/DatabaseContext";
import { type Table } from "dexie";

export type Type = {
  getAll: (
    order?: HeaderChange | null,
    range?: Range | undefined
  ) => Promise<Income[]>;
  insert: (description: string, value: number, date: number) => Promise<Income>;
  update: (
    id: number,
    description: string,
    value: number,
    date: number
  ) => Promise<number>;
  delete: (id: number) => Promise<void>;
};

type IncomeColumns = "date" | "id" | "description" | "value";

const incomeDao = (table: Table): Type => ({
  getAll: async (order, range) => {
    let list = [];
    if (range)
      list = await table
        .where(range.column)
        .between(range.lower, range.upper, range.lowerOpen, range.upperOpen)
        .toArray();
    else list = await table.toArray();

    if (!order) return list;

    return list.sort((a, b) =>
      sort[order.direction](a, b, order.column as IncomeColumns)
    );
  },
  insert: async (description, value, date) =>
    table.add({ description, value, date }),
  update: async (id, description, value, date) =>
    table.update(id, { description, value, date }),
  delete: async (id) => table.delete(id),
});

const sort = {
  next: (a: Income, b: Income, prop: IncomeColumns) => _sort(b[prop], a[prop]),
  prev: (a: Income, b: Income, prop: IncomeColumns) => _sort(a[prop], b[prop]),
};

const _sort = (a: number | string, b: number | string) => {
  if (a > b) return -1;
  if (b > a) return 1;
  return 0;
};

export default incomeDao;
