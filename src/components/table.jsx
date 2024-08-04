"use client";
import React, { useMemo, useState } from "react";
import Cell from "./cell";
import PropTypes from "prop-types";
import Header from "./header";

const Table = ({
  list,
  model,
  onChange,
  onDelete,
  onChangeOrder = () => null,
}) => {
  const [editing, setEditing] = useState({});

  const onChangeValue = (idx, key, value) =>
    setEditing({ ...editing, [`${idx}.${key}`]: value });

  const onSubmit = (idx, key) => {
    let aux = list;
    aux[idx][key] = editing[`${idx}.${key}`];
    onChange(aux[idx]);
  };

  const header = useMemo(
    () => <Header headers={Object.keys(model)} onChange={onChangeOrder} />,
    [model]
  );

  const body = list.map((item, idx) => (
    <tr key={item}>
      {Object.entries(model).map(([key, { type, readonly, values }]) => (
        <Cell
          key={key}
          type={type}
          dropdownValue={values || []}
          value={editing[`${idx}.${key}`] ?? item[key]}
          disabled={readonly}
          placeholder={key}
          onChange={(value) => onChangeValue(idx, key, value)}
          onSubmit={() => onSubmit(idx, key)}
          onCancel={() => onChangeValue(idx, key, item[key])}
        />
      ))}
      {onDelete && (
        <button
          className="rounded-lg p-2 bg-red-500 font-bold"
          onClick={() => onDelete(item)}
        >
          &#x1f5d1;
        </button>
      )}
    </tr>
  ));

  if (!list.length) return <div>Tabela Vazia</div>;
  return (
    <table className="table-auto w-full text-left">
      <thead>
        <tr>{header}</tr>
      </thead>
      <tbody>{body}</tbody>
    </table>
  );
};

Table.propTypes = {
  list: PropTypes.array,
  model: PropTypes.object,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  onChangeOrder: PropTypes.func,
};
export default Table;
