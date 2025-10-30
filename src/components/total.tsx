import React, { useMemo } from "react";
import { useTranslations } from "next-intl";

type Props = {
  className?: string;
  expenses: { value: number }[];
  income: { value: number }[];
};

const CURRENCE = "R$";

const Total = ({ className = "", expenses, income }: Props) => {
  const t = useTranslations("home");

  const totalExpenses = useMemo(
    () => expenses.reduce((acc, curr) => acc + Number(curr.value), 0),
    [expenses]
  );

  const totalIncome = useMemo(
    () => income.reduce((acc, curr) => acc + Number(curr.value), 0),
    [income]
  );

  const balance = totalIncome - totalExpenses;

  return (
    <div className={className}>
      <div className="text-4xl">
        {`${t("total_expenses")}: ${CURRENCE} ${totalExpenses.toFixed(2)}`}
      </div>
      <div className="text-4xl">
        {`${t("total_income")}: ${CURRENCE} ${totalIncome.toFixed(2)}`}
      </div>
      <div
        className={`text-4xl ${
          balance < 0 ? "text-red-500" : "text-green-500"
        }`}
      >
        {`${t("balance")}: ${CURRENCE} ${balance.toFixed(2)}`}
      </div>
    </div>
  );
};

export default Total;
