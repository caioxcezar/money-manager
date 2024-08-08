import React from "react";
import PropTypes from "prop-types";
import { fromMillis, toMillis } from "@/Utils/dates";

const CURRENCE = "R$";

const Input = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  type = "default",
  className = "",
  disabled = false,
  onSubmit = () => null,
  onCancel = () => null,
}) => {
  const labelStyle = error
    ? "block mb-2 text-sm font-medium text-red-900 dark:text-red-400 text-sm"
    : "block mb-2 font-medium text-sm";

  const inputStyle = error
    ? "border border-red-900 text-red-900 placeholder-red-700 text-sm rounded-lg bg-transparent block w-full p-2.5 dark:text-red-400 dark:placeholder-red-400 dark:border-red-400"
    : "block w-full p-2 border border-gray-300 rounded-lg bg-transparent dark:border-gray-600 dark:placeholder-gray-400";

  const formatOnChange = (value) => {
    switch (type) {
      case "cpf":
        value = value.replace(/\D/g, "");
        break;
      case "money":
        value = value.replace(/[^0-9.]/g, "");
        break;
      case "number":
        value = Number(value.replace(/[^0-9.]/g, ""));
        break;
      case "datetime-local":
        value = toMillis(value);
        break;
    }
    return value;
  };

  const _onChange = ({ target: { value, files } }) => {
    if (type == "file") onChange(files[0] || null);
    else onChange(formatOnChange(value));
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
      const aux =
        typeof value != "string" ? value : value.replace(/[^0-9.]/g, "");
      return `${CURRENCE} ${aux}`;
    }
    if (type == "datetime-local") {
      return value ? fromMillis(value) : "";
    }
    if (type == "number") {
      return `${value}`;
    }
    return value;
  };

  const displayValue = formatValue();

  return (
    <div className="mb-4">
      <label className={labelStyle}>{label}</label>
      <input
        disabled={disabled}
        className={className || inputStyle}
        placeholder={placeholder}
        value={displayValue}
        onChange={_onChange}
        type={type}
        onKeyUp={(event) => {
          if (event.key === "Enter") onSubmit(value);
          if (event.key === "Escape") onCancel(value);
        }}
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
  onCancel: PropTypes.func,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.oneOf([
    "password",
    "cpf",
    "default",
    "number",
    "datetime-local",
  ]),
};
export default Input;
