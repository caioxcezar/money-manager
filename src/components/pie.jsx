import React, { useEffect, useState } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import CategoryDao from "@/dao/category";
import PropTypes from "prop-types";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;
const Pie = ({ className, expenses }) => {
  const [pie, setPie] = useState([]);
  useEffect(() => {
    onLoad();
  }, [expenses]);

  const onLoad = async () => {
    const pie = {};
    const categories = await CategoryDao.getAll();

    for (const { category, value } of expenses) {
      if (!pie[category]) pie[category] = 0;
      pie[category] += value;
    }

    setPie(
      Object.entries(pie).map(([key, value]) => ({
        y: value,
        label: categories.find(({ id }) => id == key).description,
      }))
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
        indexLabel: "{label} #percent%",
        yValueFormatString: "R$ ##0.00",
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
  expenses: PropTypes.array,
};

export default Pie;
