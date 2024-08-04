import React from "react";
import PropTypes from "prop-types";
import { fromMillis, toMillis } from "@/Utils/dates";

const Cell = ({
  type,
  value,
  dropdownValue,
  placeholder,
  disabled,
  onChange,
  onSubmit,
  onCancel,
}) => {
  switch (type) {
    case "Number":
    case "String":
      return (
        <td>
          <input
            disabled={disabled}
            className={"bg-transparent"}
            placeholder={placeholder}
            value={value}
            onChange={({ target: { value } }) => onChange(value)}
            onKeyUp={(event) => {
              if (event.key === "Enter") onSubmit(event);
              if (event.key === "Escape") onCancel(event);
            }}
          />
        </td>
      );
    case "Date":
      return (
        <td>
          <input
            disabled={disabled}
            type={"datetime-local"}
            className={"bg-transparent"}
            placeholder={placeholder}
            value={fromMillis(value)}
            onChange={({ target: { value } }) => onChange(toMillis(value))}
            onKeyUp={(event) => {
              if (event.key === "Enter") onSubmit(value);
              if (event.key === "Escape") onCancel(value);
            }}
          />
        </td>
      );
    case "Dropdown":
      return (
        <td>
          <select
            name="select"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={({ target: { value } }) => onSubmit(value)}
          >
            {dropdownValue.map((item) => (
              <option key={item.id} value={item.id} selected={item.id == value}>
                {item.value}
              </option>
            ))}
          </select>
        </td>
      );
    default:
      return <td>{value}</td>;
  }
};

Cell.propTypes = {
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  dropdownValue: PropTypes.array,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Cell;
