import React from "react";
import PropTypes from "prop-types";

const CURRENCE = "R$";

const Input = ({
  label,
  placeholder,
  value,
  onChange,
  onSubmit,
  error,
  type = "default",
}) => {
  const labelStyle = error
    ? "block mb-2 text-sm font-medium text-red-700 dark:text-red-500 text-sm"
    : "block mb-2 font-medium text-gray-900 dark:text-white text-sm";

  const inputStyle = error
    ? "border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
    : "block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500";

  const _onChange = (value) => {
    switch (type) {
      case "cpf":
        value = value.replace(/\D/g, "");
        break;
      case "money": {
        value = value.replace(/[^0-9.]/g, "");
        break;
      }
      case "number": {
        value = value.replace(/[^0-9.]/g, "");
        break;
      }
    }
    onChange(value);
  };

  const formatValue = () => {
    if (type == "cpf")
      return value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
    if (type == "money") {
      const aux = value.replace(/[^0-9.]/g, "");
      return `${CURRENCE} ${aux}`;
    }
  };

  const displayValue = formatValue();

  return (
    <div className="mb-4">
      <label className={labelStyle}>{label}</label>

      <input
        className={inputStyle}
        placeholder={placeholder}
        value={displayValue}
        onChange={({ target: { value } }) => _onChange(value)}
        onSubmit={() => onSubmit()}
        type={type}
      />
    </div>
  );
};
Input.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  error: PropTypes.bool,
  type: PropTypes.oneOf(["password", "cpf", "default", "number"]),
};
export default Input;
