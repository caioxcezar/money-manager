import React, { useMemo } from "react";
import { useTranslations } from "next-intl";

type Props = { className?: string; expenses: { value: number }[] };

const CURRENCE = "R$";

const Total = ({ className = "", expenses }: Props) => {
  const t = useTranslations("home");

  const value = useMemo(
    () => expenses.reduce((acc, curr) => acc + Number(curr.value), 0),
    [expenses]
  );

  return (
    <div className={className}>
      <div className="text-4xl">
        {`${t("total")}: ${CURRENCE} ${value.toFixed(2)}`}
      </div>
    </div>
  );
};

export default Total;
