"use client";
import React, { useState } from "react";
import Cell, { CellTypes } from "./cell";
import Header, { type HeaderChange } from "./header";
import { type DropdownOption } from "./dropdown";
import { type InputType } from "./input";

type Prop<T extends Row> = {
  list: T[];
  model: Model[];
  onChange: (item: T) => void;
  onDelete?: (item: T) => void;
  onChangeOrder: (direction: HeaderChange) => void;
  initialSort?: HeaderChange;
};

interface Row {
  id: number;
  [key: string]: string | number;
}

type Model = {
  key: string;
  type: InputType | CellTypes;
  readonly: boolean;
  values?: DropdownOption[];
};

function Table<T extends Row>({
  list,
  model,
  onChange,
  onDelete,
  initialSort,
  onChangeOrder = () => null,
}: Prop<T>) {
  const [editing, setEditing] = useState<{ [key: string]: string | number }>(
    {}
  );

  const onChangeValue = (idx: number, key: string, value: string | number) => {
    setEditing((prev) => ({ ...prev, [`${idx}.${key}`]: value }));
  };

  const onSubmit = (value: string | number, idx: number, key: string) =>
    onChange({ ...list[idx], [key]: value });

  const headers = model.map(({ key }) => key);
  if (onDelete) headers.push("Action");

  const body = list.map((item, idx) => (
    <tr
      key={item.id}
      className="odd:bg-tb-row-odd even:bg-tb-row-even border-b dark:border-gray-700"
    >
      {model.map(({ key, type, readonly, values }) => {
        return (
          <Cell
            key={key}
            type={readonly ? CellTypes.TEXT : type}
            dropdownValue={values || []}
            value={(editing[`${idx}.${key}`] ?? item[key]).toString()}
            placeholder={key}
            onChange={(value) => {
              if (value == null || value instanceof File) return;
              onChangeValue(idx, key, value);
            }}
            onSubmit={(value, e) => {
              if (value == null || value instanceof File) return;
              e.blur();
              onSubmit(value, idx, key);
            }}
            onCancel={() => onChangeValue(idx, key, item[key])}
          />
        );
      })}
      {onDelete && (
        <td className="px-3 whitespace-nowrap">
          <button
            className="rounded-lg p-2 bg-red-500 hover:bg-red-600 font-bold"
            onClick={() => onDelete(item)}
          >
            &#x1f5d1;
          </button>
        </td>
      )}
    </tr>
  ));

  if (!list.length) return <div>Tabela Vazia</div>;
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg border">
      <table className="w-full text-sm text-left rtl:text-right">
        <thead className="text-xs uppercase">
          <tr>
            <Header
              headers={headers}
              initialSort={initialSort}
              onChange={onChangeOrder}
            />
          </tr>
        </thead>
        <tbody>{body}</tbody>
      </table>
    </div>
  );
}

export default Table;
