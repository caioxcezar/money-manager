import React from "react";
import PropTypes from "prop-types";

const Dropdown = ({
  text = "Select a value",
  options = [],
  onChange = () => null,
  value,
  error,
  className,
}) => {
  const labelStyle = error
    ? "block mb-2 text-sm font-medium text-red-700 dark:text-red-400"
    : "block mb-2 text-sm font-medium text-gray-900 dark:text-white";

  const inputStyle = error
    ? "bg-gray-50 border border-red-300 text-red-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-canvas-gray dark:border-red-400 dark:placeholder-gray-400 dark:text-red-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
    : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-canvas-gray dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

  return (
    <div className={className}>
      {text && <label className={labelStyle}>{text}</label>}
      <select
        className={inputStyle}
        onChange={({ target: { value } }) => onChange(value)}
      >
        {options.map((option) => (
          <option
            key={option.id}
            selected={value == option.id}
            value={option.id}
          >
            {option.value}
          </option>
        ))}
      </select>
    </div>
  );
};
Dropdown.propTypes = {
  className: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.func,
  text: PropTypes.string,
  value: PropTypes.object,
  error: PropTypes.bool,
};

export default Dropdown;
