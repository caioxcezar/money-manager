import React, { useMemo } from "react";
import PropTypes from "prop-types";

const CURRENCE = "R$";

const Total = ({ className, expenses }) => {
  const value = useMemo(
    () => expenses.reduce((acc, curr) => acc + Number(curr.value), 0),
    [expenses]
  );

  return (
    <div className={className}>
      <spam className="text-4xl">
        {`Total: ${CURRENCE} ${value.toFixed(2)}`}
      </spam>
    </div>
  );
};

Total.propTypes = {
  className: PropTypes.string,
  expenses: PropTypes.array,
};

export default Total;
