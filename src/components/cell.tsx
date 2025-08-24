import React from "react";
import Input, { type InputType } from "./input";
import Dropdown, { type DropdownOption } from "./dropdown";

type Props = {
  type: InputType | CellTypes;
  value: string;
  dropdownValue: DropdownOption[];
  placeholder: string;
  disabled?: boolean;
  onChange: (
    value: string | number | File | null,
    event: HTMLInputElement
  ) => void;
  onSubmit: (
    value: string | number | File | null,
    event: HTMLInputElement | HTMLSelectElement
  ) => void;
  onCancel: (
    value: string | number | File | null,
    event: HTMLInputElement
  ) => void;
};

export enum CellTypes {
  DROPDOWN = "dropdown",
  TEXT = "text",
}

const Cell = ({
  type,
  value,
  dropdownValue,
  placeholder,
  disabled,
  onChange,
  onSubmit,
  onCancel,
}: Props) => {
  let inner = <></>;

  switch (type) {
    case "dropdown": {
      inner = (
        <Dropdown
          text=""
          value={value}
          options={dropdownValue}
          onChange={onSubmit}
        />
      );
      break;
    }
    case "text": {
      inner = <div>{value}</div>;
      break;
    }
    default: {
      inner = (
        <Input
          type={type as InputType}
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

export default Cell;
