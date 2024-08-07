import React, { useEffect, useState } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import { now } from "@/Utils/dates";
import ExpenseDao from "@/dao/expense";
import CategoryDao from "@/dao/category";
import PropTypes from "prop-types";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;
const Pie = ({ className, period }) => {
  const [pie, setPie] = useState([]);
  useEffect(() => {
    onLoad();
  }, [period]);

  const onLoad = async () => {
    let total = 0;
    const pie = {};
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
    const categories = await CategoryDao.getAll();

    for (const { category, value } of expenses) {
      total += value;
      if (!pie[category]) pie[category] = 0;
      pie[category] += value;
    }

    setPie(
      Object.entries(pie).map(([key, value]) => {
        const y = ((value * 100) / total).toFixed(2);
        return {
          y,
          label: categories.find(({ id }) => id == key).description,
        };
      })
    );
  };

  const options = {
    animationEnabled: true,
    exportEnabled: true,
    theme: "dark1",
    title: { text: "Expenses" },
    data: [
      {
        type: "pie",
        indexLabel: "{label}: {y}%",
        startAngle: -90,
        dataPoints: pie,
      },
    ],
  };
  return (
    <div className={className}>
      <CanvasJSChart options={options} />
    </div>
  );
};

Pie.propTypes = {
  className: PropTypes.string,
  period: PropTypes.string,
};

export default Pie;
