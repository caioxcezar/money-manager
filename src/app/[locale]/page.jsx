"use client";
import React, { useEffect, useState, useRef } from "react";
import Page from "@/components/page";
import dynamic from "next/dynamic";
import Dropdown from "@/components/dropdown";
import Total from "@/components/total";
import ExpenseDao from "@/dao/expense";
import { fromString, now } from "@/utils/dates";
import { useTranslations } from "next-intl";
const Pie = dynamic(() => import("@/components/pie"), { ssr: false });

const Home = () => {
  const t = useTranslations("home");

  const dateSpan = useRef([
    { id: 1, value: t("mode_monthly") },
    { id: 2, value: t("mode_yearly") },
  ]).current;

  const months = useRef([
    { id: "01", value: t("january") },
    { id: "02", value: t("february") },
    { id: "03", value: t("march") },
    { id: "04", value: t("april") },
    { id: "05", value: t("may") },
    { id: "06", value: t("june") },
    { id: "07", value: t("july") },
    { id: "08", value: t("august") },
    { id: "09", value: t("september") },
    { id: "10", value: t("october") },
    { id: "11", value: t("november") },
    { id: "12", value: t("december") },
  ]).current;

  const [years, setYears] = useState([]);
  const [option, setOption] = useState(1);
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

    if (option == 2) {
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
          text={t("select_mode")}
          options={dateSpan}
          value={option}
          onChange={setOption}
        />
        {option == 1 && (
          <Dropdown
            text={t("select_mouth")}
            options={months}
            value={date.month}
            onChange={(month) => setDate({ year: date.year, month })}
          />
        )}
        <Dropdown
          text={t("select_year")}
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
