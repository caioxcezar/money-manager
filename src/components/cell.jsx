import React from "react";
import PropTypes from "prop-types";
import Input from "./input";
import Dropdown from "./dropdown";

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
        <Dropdown
          text={null}
          value={value}
          options={dropdownValue}
          onChange={(value) => onSubmit(value)}
        />
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
