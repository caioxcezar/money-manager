import React from "react";
import PropTypes from "prop-types";
import Input from "./input";

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
  if (type == "Dropdown")
    return (
      <td>
        <select
          name="select"
          className="bg-canvas-lgray border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-canvas-lgray dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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

  const _type = {
    Money: "money",
    Date: "datetime-local",
    _: type,
  };

  return (
    <td>
      <Input
        type={_type[type]}
        disabled={disabled}
        className={"bg-transparent"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </td>
  );
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
