import React from "react";
import PropTypes from "prop-types";

const Checkbox = ({ label, value, onChange }) => {
  return (
    <div className="flex items-center mb-4">
      <input
        type="checkbox"
        checked={value}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:border-gray-600"
        onChange={({ target: { checked } }) => onChange(checked)}
      />
      <label className="ms-2 text-sm font-medium">{label}</label>
    </div>
  );
};

Checkbox.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.bool,
  onChange: PropTypes.func,
};
export default Checkbox;
