"use client";
import React, { useEffect, useState } from "react";
import Page from "@/components/page";
import Table from "@/components/table";
import { toast } from "react-toastify";
import ExpenseDao from "@/dao/expense";
import Input from "@/components/input";
import Button from "@/components/button";
import Dropdown from "@/components/Dropdown";
import CategoryDao from "@/dao/category";
import _expense from "@/models/expense";
import { fromMillis, fromString, now } from "@/Utils/dates";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [expense, setExpense] = useState(_expense);

  const [description, setDescription] = useState({ value: "", error: true });
  const [category, setCategory] = useState({ value: {}, error: true });
  const [date, setDate] = useState({ value: "", error: true });
  const [amountSpent, setAmount] = useState({ value: "", error: true });
  const [repeat, setRepeat] = useState(0);

  const [order, setOrder] = useState({ title: "id", order: "next" });
  const [startingDate, setStartingDate] = useState(now().toMillis());
  const [endingDate, setEndingDate] = useState(now().toMillis());

  useEffect(() => {
    loadCategories();
    setFilter();
  }, []);

  useEffect(() => {
    loadData();
  }, [startingDate, endingDate, order]);

  const setFilter = () => {
    const today = now();
    setStartingDate(today.startOf("month").toMillis());
    setEndingDate(today.endOf("month").toMillis());
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
    if (categories.length) setCategory({ error: false, value: categories[0] });
  };

  const loadData = async () => {
    try {
      const all = await ExpenseDao.getRange(order, {
        lower: startingDate,
        upper: endingDate,
        lowerOpen: false,
        upperOpen: false,
      });
      setExpenses(all);
    } catch (error) {
      toast.error(error);
    }
  };

  const updateExpense = async ({
    id,
    description,
    category,
    date,
    amountSpent,
  }) => {
    try {
      await ExpenseDao.update(id, description, category, date, amountSpent);
      loadData();
      toast.success("Updated successfully");
    } catch (error) {
      toast.error("Error while updateding");
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
        return toast.error("Fill in all fields");

      for (let i = 0; i <= repeat; i++) {
        let rDate = fromMillis(date.value);
        rDate = fromString(rDate);
        rDate = rDate.set({ month: rDate.month + i });

        await ExpenseDao.insert(
          description.value,
          category.value,
          rDate.toMillis(),
          Number(amountSpent.value)
        );
      }

      loadData();
      toast.success("Sucesso~!");
    } catch (error) {
      console.error(error);
      toast.error("Unable to save");
    }
  };

  const deleteExpense = async ({ id }) => {
    try {
      await ExpenseDao.delete(id);
      loadData();
      toast.success("Deleted successfully");
    } catch (error) {
      toast.error("Error while deleting");
    } finally {
      loadData();
    }
  };

  return (
    <Page title="Expenses">
      <div className="border m-2 rounded-lg p-2">
        <span className="text-2xl">Create New</span>
        <Input
          label={"Description"}
          value={description}
          onChange={(value) => setDescription({ error: !value.trim(), value })}
          error={description.error}
        />
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              label={"Date"}
              type={"datetime-local"}
              onChange={(value) => setDate({ error: !value, value })}
              value={date.value}
              error={date.error}
            />
          </div>
          <div className="flex-1">
            <Input
              type={"number"}
              label={"Repeat (this entry + value)"}
              onChange={setRepeat}
              value={repeat}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <Dropdown
              text="Select the category"
              value={category.value}
              options={expense.category.values || []}
              onChange={(value) => setCategory({ error: false, value })}
              error={category.error}
            />
          </div>
          <div className="flex-1">
            <Input
              type={"money"}
              label={"Amount Spent"}
              onChange={(value) => setAmount({ error: !value.trim(), value })}
              value={amountSpent.value}
              error={amountSpent.error}
            />
          </div>
        </div>

        <Button onClick={insertExpense} title="Create new" />
      </div>
      <div className="border m-2 rounded-lg p-2">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              label={"Starting Date"}
              type={"datetime-local"}
              onChange={setStartingDate}
              value={startingDate}
            />
          </div>
          <div className="flex-1">
            <Input
              type={"datetime-local"}
              label={"Ending Date"}
              onChange={setEndingDate}
              value={endingDate}
            />
          </div>
        </div>
      </div>
      <Table
        list={expenses}
        model={expense}
        onChange={updateExpense}
        onChangeOrder={setOrder}
        onDelete={deleteExpense}
      />
    </Page>
  );
};
export default Expenses;
