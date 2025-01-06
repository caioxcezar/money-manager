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
  let inner = <></>;

  switch (type) {
    case "Dropdown": {
      inner = (
        <Dropdown
          text={null}
          value={value}
          options={dropdownValue}
          onChange={(value) => onSubmit(value)}
        />
      );
      break;
    }
    case "text": {
      inner = <div>{value}</div>;
      break;
    }
    default: {
      const _type = {
        Money: "money",
        Date: "datetime-local",
        _: type,
      };

      inner = (
        <Input
          type={_type[type]}
          disabled={disabled}
          className="bg-transparent w-full"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      );
    }
  }

  return <td className="px-3 whitespace-nowrap">{inner}</td>;
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
