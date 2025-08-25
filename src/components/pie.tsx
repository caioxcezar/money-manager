import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import useDatabase from "@/hooks/useDatabase";
import { type Expense } from "@/contexts/DatabaseContext";
// @ts-ignore
import CanvasJSReact from "@canvasjs/react-charts";

type Props = {
  className?: string;
  expenses: Expense[];
};

type ChartData = {
  y: number;
  label: string;
};

const CanvasJSChart = CanvasJSReact.CanvasJSChart;
const Pie = ({ className, expenses }: Props) => {
  const database = useDatabase();

  const t = useTranslations("home");

  const [pie, setPie] = useState<ChartData[]>([]);
  useEffect(() => {
    onLoad();
  }, [expenses]);

  const onLoad = async () => {
    const pie: { [key: number]: number } = {};
    const categories = await database.categories.getAll();

    for (const { category, value } of expenses) {
      if (!pie[category]) pie[category] = 0;
      pie[category] += value;
    }

    setPie(
      Object.entries(pie).map(([key, value]) => ({
        y: value,
        label: categories.find(({ id }) => id.toString() == key)!.description,
      }))
    );
  };

  const options = {
    animationEnabled: true,
    exportEnabled: true,
    theme: "dark1",
    title: { text: t("cavas_expenses_title") },
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

export default Pie;
