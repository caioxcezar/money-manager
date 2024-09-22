"use client";
import React, { useEffect, useState } from "react";
import Page from "@/components/page";
import dynamic from "next/dynamic";
import Dropdown from "@/components/dropdown";
import Total from "@/components/total";
import ExpenseDao from "@/dao/expense";
import { fromString, now } from "@/Utils/dates";
const Pie = dynamic(() => import("@/components/pie"), { ssr: false });

const months = [
  { id: "01", value: "January" },
  { id: "02", value: "February" },
  { id: "03", value: "March" },
  { id: "04", value: "April" },
  { id: "05", value: "May" },
  { id: "06", value: "June" },
  { id: "07", value: "July" },
  { id: "08", value: "August" },
  { id: "09", value: "September" },
  { id: "10", value: "October" },
  { id: "11", value: "November" },
  { id: "12", value: "December" },
];
const dateSpan = [
  { id: 1, value: "monthly" },
  { id: 2, value: "yearly" },
];
const Home = () => {
  const [years, setYears] = useState([]);
  const [option, setOption] = useState("monthly");
  const [expenses, setExpenses] = useState([]);
  const [date, setDate] = useState({
    month: months.find(({ id }) => now().toFormat("MM") == id)?.id || 1,
    year: Number(now().toFormat("yyyy")),
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    let years = [];
    const first = await ExpenseDao.getInitialDate();
    for (let i = Number(now().toFormat("yyyy")); i >= Number(first); i--) {
      years.push({ id: i, value: i });
    }
    setYears(years);
  };

  useEffect(() => {
    updateExpenses();
  }, [option, date]);

  const updateExpenses = async () => {
    const range = {
      column: "date",
      lowerOpen: false,
      upperOpen: false,
    };

    if (option == "yearly") {
      const lower = fromString(`${date.year}-01-01T00:00:00.000`);
      range.lower = lower.toMillis();
      range.upper = lower.endOf("year").toMillis();
    } else {
      const lower = fromString(`${date.year}-${date.month}-01T00:00:00.000`);
      range.lower = lower.toMillis();
      range.upper = lower.endOf("month").toMillis();
    }

    const expenses = await ExpenseDao.getAll(null, range);
    setExpenses(expenses);
  };

  return (
    <Page>
      <div className="flex gap-2 mb-2">
        <Dropdown
          text="Select Option"
          options={dateSpan}
          value={option}
          onChange={(value) => setOption(value == 1 ? "monthly" : "yearly")}
        />
        {option == "monthly" && (
          <Dropdown
            text="Select Month"
            options={months}
            value={date.month}
            onChange={(month) => setDate({ year: date.year, month })}
          />
        )}
        <Dropdown
          text="Select Year"
          options={years}
          value={date.year}
          onChange={(year) => setDate({ year, month: date.month })}
        />
      </div>
      <Total expenses={expenses} />
      <Pie expenses={expenses} />
    </Page>
  );
};
export default Home;
