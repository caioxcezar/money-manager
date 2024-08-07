import React, { useEffect, useState } from "react";
import { now } from "@/Utils/dates";
import ExpenseDao from "@/dao/expense";
import PropTypes from "prop-types";

const CURRENCE = "R$";

const Total = ({ className, period }) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    onLoad();
  }, [period]);

  const onLoad = async () => {
    const today = now();
    const range = {
      column: "date",
      lowerOpen: false,
      upperOpen: false,
    };

    if (period == "yearly") {
      range.lower = today.startOf("year").toMillis();
      range.upper = today.endOf("year").toMillis();
    } else {
      range.lower = today.startOf("month").toMillis();
      range.upper = today.endOf("month").toMillis();
    }

    const expenses = await ExpenseDao.getAll(null, range);
    setValue(expenses.reduce((acc, curr) => acc + Number(curr.value), 0));
  };

  return (
    <div className={className}>
      <spam className="text-4xl">
        Total: {`${CURRENCE} ${value.toFixed(2)}`}
      </spam>
    </div>
  );
};

Total.propTypes = {
  className: PropTypes.string,
  period: PropTypes.string,
};

export default Total;
