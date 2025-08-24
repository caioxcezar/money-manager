import React from "react";

type Props = {
  label: string;
  placeholder?: string;
  value: boolean;
  onChange: (value: boolean, event: HTMLInputElement) => void;
};

const Checkbox = ({ label, value, onChange }: Props) => {
  return (
    <div className="flex items-center mb-4">
      <input
        type="checkbox"
        checked={value}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:border-gray-600"
        onChange={({ target }) => onChange(target.checked, target)}
      />
      <label className="ms-2 text-sm font-medium">{label}</label>
    </div>
  );
};

export default Checkbox;
