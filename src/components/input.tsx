import React from "react";
import { fromMillis, toMillis } from "@/utils/dates";

type Props = {
  value: string;
  onChange: (
    value: string | number | File | null,
    event: HTMLInputElement
  ) => void;
  placeholder?: string;
  onSubmit?: (
    value: string | number | File | null,
    event: HTMLInputElement
  ) => void;
  onCancel?: (
    value: string | number | File | null,
    event: HTMLInputElement
  ) => void;
  disabled?: boolean;
  className?: string;
  type?: InputType;
  error?: boolean;
  label?: string;
};

export enum InputType {
  PASSWORD = "password",
  CPF = "cpf",
  DEFAULT = "default",
  NUMBER = "number",
  DATETIME_LOCAL = "datetime-local",
  MONEY = "money",
  FILE = "file",
}

const CURRENCE = "R$";

const Input = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  type = InputType.DEFAULT,
  className = "",
  disabled = false,
  onSubmit = () => null,
  onCancel = () => null,
}: Props) => {
  const labelStyle = error
    ? "block mb-2 text-sm font-medium text-red-900 dark:text-red-400 text-sm"
    : "block mb-2 font-medium text-sm";

  const inputStyle = error
    ? "border border-red-900 text-red-900 placeholder-red-700 text-sm rounded-lg bg-transparent block w-full p-2.5 dark:text-red-400 dark:placeholder-red-400 dark:border-red-400"
    : "block w-full p-2 border border-gray-300 rounded-lg bg-transparent dark:border-gray-600 dark:placeholder-gray-400";

  const formatOnChange = (value: string): string | number => {
    switch (type) {
      case InputType.CPF:
        return value.replace(/\D/g, "");
      case InputType.MONEY:
        return value.replace(/[^0-9.,]/g, "").replace(/,/, ".");
      case InputType.NUMBER:
        return Number(value.replace(/[^0-9.,]/g, "").replace(/,/, "."));
      case InputType.DATETIME_LOCAL:
        return toMillis(value);
      default:
        return value;
    }
  };

  const _onChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { value, files } = target;
    if (type === InputType.FILE) onChange(files ? files[0] : null, target);
    else onChange(formatOnChange(value), target);
  };

  const formatValue = (): string => {
    if (type == InputType.CPF)
      return value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");

    if (type == InputType.MONEY)
      return `${CURRENCE} ${value.replace(/[^0-9.]/g, "")}`;

    if (type == InputType.DATETIME_LOCAL) {
      const millis = Number(value);
      return millis ? fromMillis(millis) : "";
    }

    if (type == InputType.NUMBER) return `${value}`;

    return value;
  };

  return (
    <div className="mb-4">
      <label className={labelStyle}>{label}</label>
      <input
        disabled={disabled}
        className={className || inputStyle}
        placeholder={placeholder}
        value={formatValue()}
        onChange={_onChange}
        type={type}
        onKeyUp={({ key, target }) => {
          if (!["Enter", "Escape"].includes(key)) return;
          if (key === "Enter") onSubmit(value, target as HTMLInputElement);
          if (key === "Escape") onCancel(value, target as HTMLInputElement);
        }}
      />
    </div>
  );
};

export default Input;
