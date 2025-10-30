import { useContext, useMemo } from "react";
import { DatabaseContext } from "@/contexts/DatabaseContext";
import CategoryDao, { type Type as CategoryType } from "@/dao/category";
import ExpenseDao, { type Type as ExpenseType } from "@/dao/expense";
import IncomeDao, { type Type as IncomeType } from "@/dao/income";

const useDatabase = () => {
  const context = useContext(DatabaseContext);
  const db = context?.db;

  const init = () => context!.init();
  const open = (table: "expenses" | "categories" | "income") =>
    context!.open(table);

  const expenses: ExpenseType = useMemo(
    () => ExpenseDao(open("expenses")),
    [context]
  );
  const categories: CategoryType = useMemo(
    () => CategoryDao(open("categories")),
    [context]
  );
  const income: IncomeType = useMemo(
    () => IncomeDao(open("income")),
    [context]
  );

  return { open, db, init, expenses, categories, income };
};

export default useDatabase;
