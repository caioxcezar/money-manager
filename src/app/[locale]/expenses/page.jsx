"use client";
import React, { useEffect, useMemo, useState } from "react";
import Page from "@/components/page";
import Table from "@/components/table";
import { toast } from "react-toastify";
import ExpenseDao from "@/dao/expense";
import Input from "@/components/input";
import Button from "@/components/button";
import Dropdown from "@/components/dropdown";
import CategoryDao from "@/dao/category";
import _expense from "@/models/expense";
import { fromMillis, fromString, now } from "@/utils/dates";
import Group from "@/components/group";
import Fuse from "fuse.js";
import { useTranslations } from "next-intl";

const Expenses = () => {
  const t = useTranslations("expenses");

  const [expenses, setExpenses] = useState([]);
  const [expense, setExpense] = useState(_expense);

  const [description, setDescription] = useState({ value: "", error: true });
  const [category, setCategory] = useState({ value: "1", error: true });
  const [date, setDate] = useState({ value: "", error: true });
  const [amountSpent, setAmount] = useState({ value: "", error: true });
  const [repeat, setRepeat] = useState(0);

  const [order, setOrder] = useState({ column: "date", direction: "prev" });

  const [filter, _setFilter] = useState({
    startingDate: now().toMillis(),
    endingDate: now().toMillis(),
    description: "",
    category: "-1",
  });
  const setFilter = (values) => _setFilter({ ...filter, ...values });

  useEffect(() => {
    loadCategories();
    setFilterValues();
  }, []);

  useEffect(() => {
    loadData();
  }, [filter, order]);

  const setFilterValues = () => {
    const today = now();
    setFilter({
      startingDate: today.startOf("month").toMillis(),
      endingDate: today.endOf("month").toMillis(),
    });
  };

  const loadCategories = async () => {
    const categories = await CategoryDao.getAll();
    setExpense({
      ...expense,
      category: {
        type: "Dropdown",
        indexed: true,
        values: categories.map((ct) => ({
          id: ct.id,
          value: ct.description,
        })),
      },
    });
    if (categories.length)
      setCategory({ error: false, value: categories[0].id });
  };

  const loadData = async () => {
    try {
      let all = await ExpenseDao.getAll(order, {
        column: "date",
        lower: filter.startingDate,
        upper: filter.endingDate,
        lowerOpen: false,
        upperOpen: false,
      });
      if (filter.description.trim()) {
        const fuse = new Fuse(all, { keys: ["description"] });
        all = fuse.search(filter.description).map(({ item }) => item);
      }
      if (filter.category != "-1") {
        all = all.filter(({ category }) => category == filter.category);
      }
      setExpenses(all);
    } catch (error) {
      toast.error(error);
    }
  };

  const updateExpense = async ({ id, description, category, date, value }) => {
    try {
      if (!description.trim() || isNaN(date) || !`${value}`.trim())
        throw new Error("All fields must have value");
      await ExpenseDao.update(id, description, category, date, Number(value));
      loadData();
      toast.success("Updated successfully");
    } catch (error) {
      toast.error(`Error while updateding.\n${error.message}`);
    } finally {
      loadData();
    }
  };

  const insertExpense = async () => {
    try {
      if (
        description.error ||
        category.error ||
        date.error ||
        amountSpent.error
      )
        throw new Error("Fill in all fields");

      const itens = [];
      for (let i = 0; i <= repeat; i++) {
        let rDate = fromMillis(date.value);
        rDate = fromString(rDate);
        rDate = rDate.set({ month: rDate.month + i });

        itens.push({
          description: description.value,
          category: category.value,
          date: rDate.toMillis(),
          value: Number(amountSpent.value),
        });
      }

      await ExpenseDao.bulkInsert(itens);
      loadData();
      toast.success(t("saved_success"));
    } catch (error) {
      toast.error(`${t("saved_failed")}.\n${error.message}`);
    }
  };

  const deleteExpense = async ({ id }) => {
    try {
      await ExpenseDao.delete(id);
      loadData();
      toast.success(t("deleted_success"));
    } catch (error) {
      toast.error(`${t("deleted_failed")}.\n${error.message}`);
    } finally {
      loadData();
    }
  };

  const { categories, filterCategories } = useMemo(() => {
    const categories = expense.category.values || [];
    return {
      categories,
      filterCategories: [{ id: "-1", value: "..." }, ...categories],
    };
  }, [expense]);

  return (
    <Page title={t("title")}>
      <Group title={t("group_new_title")}>
        <Input
          label={t("input_description")}
          value={description.value}
          onChange={(value) => setDescription({ error: !value.trim(), value })}
          error={description.error}
        />
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              label={t("input_date")}
              type={"datetime-local"}
              onChange={(value) => setDate({ error: !value, value })}
              value={date.value}
              error={date.error}
            />
          </div>
          <div className="flex-1">
            <Input
              type={"number"}
              label={t("input_repeat")}
              onChange={setRepeat}
              value={repeat}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <Dropdown
              text={t("select_category")}
              value={category.value}
              options={categories}
              onChange={(value) => setCategory({ error: false, value })}
              error={category.error}
            />
          </div>
          <div className="flex-1">
            <Input
              type={"money"}
              label={t("input_money")}
              onChange={(value) => setAmount({ error: !value.trim(), value })}
              value={amountSpent.value}
              error={amountSpent.error}
            />
          </div>
        </div>

        <Button onClick={insertExpense} title={t("button_new")} />
      </Group>
      <Group title={t("group_filter_title")}>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              label={t("input_start_date")}
              type={"datetime-local"}
              onChange={(startingDate) => setFilter({ startingDate })}
              value={filter.startingDate}
            />
          </div>
          <div className="flex-1">
            <Input
              type={"datetime-local"}
              label={t("input_end_date")}
              onChange={(endingDate) => setFilter({ endingDate })}
              value={filter.endingDate}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <Dropdown
              text={t("select_category")}
              value={filter.category}
              options={filterCategories}
              onChange={(category) => setFilter({ category })}
            />
          </div>
          <div className="flex-1">
            <Input
              label={t("input_description")}
              value={filter.description}
              onChange={(description) => setFilter({ description })}
            />
          </div>
        </div>
      </Group>
      <Table
        list={expenses}
        model={expense}
        onChange={updateExpense}
        onChangeOrder={setOrder}
        onDelete={deleteExpense}
        initialSort={order}
      />
    </Page>
  );
};
export default Expenses;
