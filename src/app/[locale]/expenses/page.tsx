"use client";
import React, { useEffect, useState } from "react";
import Page from "@/components/page";
import Table from "@/components/table";
import { toast } from "react-toastify";
import Input, { InputType } from "@/components/input";
import Button from "@/components/button";
import Dropdown, { type DropdownOption } from "@/components/dropdown";
import { fromMillis, fromString, now } from "@/utils/dates";
import Group from "@/components/group";
import Fuse from "fuse.js";
import { useTranslations } from "next-intl";
import useDatabase from "@/hooks/useDatabase";
import { type Expense } from "@/contexts/DatabaseContext";
import { HeaderDirection, type HeaderChange } from "@/components/header";
import { CellTypes } from "@/components/cell";

const Expenses = () => {
  const t = useTranslations("expenses");
  const database = useDatabase();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<DropdownOption[]>([]);

  const [description, setDescription] = useState({ value: "", error: true });
  const [category, setCategory] = useState({ value: "1", error: true });
  const [date, setDate] = useState({ value: "", error: true });
  const [amountSpent, setAmount] = useState({ value: "", error: true });
  const [repeat, setRepeat] = useState(0);

  const [order, setOrder] = useState<HeaderChange>({
    column: "date",
    direction: HeaderDirection.PREV,
  });

  const [filter, setFilter] = useState({
    startingDate: now().startOf("month").toMillis(),
    endingDate: now().endOf("month").toMillis(),
    description: "",
    category: "-1",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadData();
  }, [filter, order]);

  const loadCategories = async () => {
    const categories = await database.categories.getAll();
    setCategories(
      categories.map((ct) => ({
        id: ct.id.toString(),
        value: ct.description,
      }))
    );
    if (categories.length)
      setCategory({ error: false, value: categories[0].id.toString() });
  };

  const loadData = async () => {
    try {
      let all = await database.expenses.getAll(order, {
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
        all = all.filter(
          ({ category }) => category.toString() == filter.category
        );
      }
      setExpenses(all);
    } catch (error) {
      const obj = error as Error;
      toast.error(obj.message);
    }
  };

  const updateExpense = async ({
    id,
    description,
    category,
    date,
    value,
  }: Expense) => {
    try {
      if (!description.trim() || isNaN(date) || !`${value}`.trim())
        throw new Error("All fields must have value");
      await database.expenses.update(
        id,
        description,
        category,
        date,
        Number(value)
      );
      loadData();
      toast.success("Updated successfully");
    } catch (error) {
      const obj = error as Error;
      toast.error(`Error while updateding.\n${obj.message}`);
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
        let rDate = fromString(fromMillis(Number(date.value)));
        rDate = rDate.set({ month: rDate.month + i });

        itens.push({
          description: description.value,
          category: Number(category.value),
          date: rDate.toMillis(),
          value: Number(amountSpent.value),
        });
      }

      await database.expenses.bulkInsert(itens);
      loadData();
      toast.success(t("saved_success"));
    } catch (error) {
      const obj = error as Error;
      toast.error(`${t("saved_failed")}.\n${obj.message}`);
    }
  };

  const deleteExpense = async ({ id }: Expense) => {
    try {
      await database.expenses.delete(id);
      loadData();
      toast.success(t("deleted_success"));
    } catch (error) {
      const obj = error as Error;
      toast.error(`${t("deleted_failed")}.\n${obj.message}`);
    } finally {
      loadData();
    }
  };

  const filterCategories = [{ id: "-1", value: "..." }, ...categories];

  return (
    <Page title={t("title")}>
      <Group title={t("group_new_title")}>
        <Input
          label={t("input_description")}
          value={description.value}
          onChange={(value) => {
            if (value == null || value instanceof File) return;
            const v = value.toString().trim();
            setDescription({ error: !v, value: v });
          }}
          error={description.error}
        />
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              label={t("input_date")}
              type={InputType.DATETIME_LOCAL}
              onChange={(value) => {
                if (value == null || value instanceof File) return;
                setDate({ error: !value, value: value.toString() });
              }}
              value={date.value}
              error={date.error}
            />
          </div>
          <div className="flex-1">
            <Input
              type={InputType.NUMBER}
              label={t("input_repeat")}
              onChange={(value) => {
                if (value == null || value instanceof File) return;
                setRepeat(Number(value));
              }}
              value={repeat.toString()}
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
              type={InputType.MONEY}
              label={t("input_money")}
              onChange={(value) => {
                if (value == null || value instanceof File) return;
                const v = value.toString();
                setAmount({ error: !v.trim(), value: v });
              }}
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
              type={InputType.DATETIME_LOCAL}
              onChange={(value) => {
                if (value == null || value instanceof File) return;
                setFilter((prev) => ({
                  ...prev,
                  startingDate: Number(value),
                }));
              }}
              value={filter.startingDate.toString()}
            />
          </div>
          <div className="flex-1">
            <Input
              type={InputType.DATETIME_LOCAL}
              label={t("input_end_date")}
              onChange={(value) => {
                if (value == null || value instanceof File) return;
                setFilter((prev) => ({
                  ...prev,
                  endingDate: Number(value),
                }));
              }}
              value={filter.endingDate.toString()}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <Dropdown
              text={t("select_category")}
              value={filter.category}
              options={filterCategories}
              onChange={(category) =>
                setFilter((prev) => ({ ...prev, category }))
              }
            />
          </div>
          <div className="flex-1">
            <Input
              label={t("input_description")}
              value={filter.description}
              onChange={(value) => {
                if (value == null || value instanceof File) return;
                setFilter((prev) => ({
                  ...prev,
                  description: value.toString(),
                }));
              }}
            />
          </div>
        </div>
      </Group>
      <Table<Expense>
        list={expenses}
        model={[
          { key: "id", type: InputType.NUMBER, readonly: true },
          { key: "description", type: InputType.DEFAULT, readonly: false },
          {
            key: "category",
            type: CellTypes.DROPDOWN,
            readonly: false,
            values: categories,
          },
          { key: "date", type: InputType.DATETIME_LOCAL, readonly: false },
          { key: "value", type: InputType.MONEY, readonly: false },
        ]}
        onChange={updateExpense}
        onChangeOrder={setOrder}
        onDelete={deleteExpense}
        initialSort={order}
      />
    </Page>
  );
};
export default Expenses;
