import Dropdown from "@/components/dropdown";
import React, { useEffect, useState } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import { now } from "@/Utils/dates";
import ExpenseDao from "@/dao/expense";
import CategoryDao from "@/dao/category";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;
const Pie = () => {
  const [pie, setPie] = useState([]);
  const [option, setOption] = useState([]);
  useEffect(() => {
    onLoad();
  }, [option]);

  const onLoad = async () => {
    let total = 0;
    const pie = {};
    const today = now();
    const range = {
      lowerOpen: false,
      upperOpen: false,
    };

    if (option == "2") {
      range.lower = today.startOf("year").toMillis();
      range.upper = today.endOf("year").toMillis();
    } else {
      range.lower = today.startOf("month").toMillis();
      range.upper = today.endOf("month").toMillis();
    }

    const expenses = await ExpenseDao.getRange(
      { title: "id", order: "next" },
      range
    );
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
    <div>
      <Dropdown
        className="mb-2"
        options={[
          { id: 1, value: "monthly" },
          { id: 2, value: "yearly" },
        ]}
        value={option}
        onChange={setOption}
      />
      <CanvasJSChart options={options} />
    </div>
  );
};
export default Pie;
