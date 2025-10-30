import { type HeaderChange } from "@/components/header";
import { type Range, type Expense } from "@/contexts/DatabaseContext";
import { type Table } from "dexie";
import { DateTime } from "luxon";

export type ExpenseDao = {
  description: string;
  category: number;
  date: number;
  value: number;
};

export type Type = {
  getInitialDate: () => Promise<string>;
  countBy: (column: ExpenseColumns, key: string | number) => Promise<number>;
  getAll: (
    order?: HeaderChange | null,
    range?: Range | undefined
  ) => Promise<Expense[]>;
  update: (
    id: number,
    description: string,
    category: number,
    date: number,
    value: number
  ) => Promise<number>;
  delete: (id: number) => Promise<void>;
  insert: (
    description: string,
    category: number,
    date: number,
    value: number
  ) => Promise<Expense>;
  bulkInsert: (itens: ExpenseDao[] & { id?: number }) => Promise<number[]>;
};

type ExpenseColumns = "date" | "id" | "description" | "category" | "value";

const ExpenseDao = (table: Table): Type => ({
  getInitialDate: async () => {
    const row = await table.orderBy("date").first();
    if (row) return DateTime.fromMillis(row.date).toFormat("yyyy");
    return DateTime.local().toFormat("yyyy");
  },
  countBy: (column, key) => table.where(column).equals(key).count(),
  getAll: async (order?, range?) => {
    let list = [];
    if (range)
      list = await table
        .where(range.column)
        .between(range.lower, range.upper, range.lowerOpen, range.upperOpen)
        .toArray();
    else list = await table.toArray();

    if (!order) return list;

    return list.sort((a, b) =>
      sort[order.direction](a, b, order.column as ExpenseColumns)
    );
  },
  delete: async (id) => table.delete(id),
  insert: async (description, category, date, value) =>
    table.add({ description, category, date, value }),
  bulkInsert: async (itens) => table.bulkAdd(itens),
  update: async (id, description, category, date, value) =>
    table.update(id, { description, category, date, value }),
});

const sort = {
  next: (a: Expense, b: Expense, prop: ExpenseColumns) =>
    _sort(b[prop], a[prop]),
  prev: (a: Expense, b: Expense, prop: ExpenseColumns) =>
    _sort(a[prop], b[prop]),
};

const _sort = (a: number | string, b: number | string) => {
  if (a > b) return -1;
  if (b > a) return 1;
  return 0;
};

export default ExpenseDao;
