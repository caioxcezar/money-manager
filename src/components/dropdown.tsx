import React from "react";

type Props = {
  options: DropdownOption[];
  onChange: (value: string, event: HTMLSelectElement) => void;
  text: string;
  value: string | number | readonly string[] | undefined;
  className?: string;
  disabled?: boolean;
  error?: boolean;
};

export type DropdownOption = {
  id: string;
  value: string;
};

const Dropdown = ({
  text = "Select a value",
  options = [],
  onChange = () => null,
  value,
  error = false,
  className = "",
  disabled = false,
}: Props) => {
  const labelStyle = error
    ? "block mb-2 text-sm font-medium text-red-700 dark:text-red-400"
    : "block mb-2 text-sm font-medium";

  const inputStyle = error
    ? "bg-gray-50 border border-red-300 text-red-900 text-sm rounded-lg block w-full p-2.5 dark:bg-canvas-gray dark:border-red-400 dark:placeholder-gray-400 dark:text-red-400"
    : "bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-canvas-gray dark:border-gray-600 dark:placeholder-gray-400";

  return (
    <div className={className}>
      {text && <label className={labelStyle}>{text}</label>}
      <select
        className={inputStyle}
        value={value}
        disabled={disabled}
        onChange={({ target }) => onChange(target.value, target)}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.value}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
