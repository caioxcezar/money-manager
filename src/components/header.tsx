import React, { type ReactNode, useState } from "react";
import { firstUppercase } from "@/utils/strings";

type Props = {
  headers: string[];
  onChange: (direction: HeaderChange) => void;
  initialSort?: HeaderChange;
};

export type HeaderChange = {
  column: string;
  direction: HeaderDirection;
};

export enum HeaderDirection {
  NEXT = "next",
  PREV = "prev",
}

const icon: { [key: string]: ReactNode | null } = {
  next: <>&#x2193;</>,
  prev: <>&#x2191;</>,
  _: null,
};

const Header = ({
  headers,
  onChange,
  initialSort = { column: "", direction: HeaderDirection.NEXT },
}: Props) => {
  const [orderedHeader, setOrderedHeader] = useState(
    headers.findIndex((header) => header == initialSort.column) || 0
  );
  const [order, setOrder] = useState(initialSort.direction);

  const onClick = (column: string, id: number) => {
    let direction = HeaderDirection.NEXT;
    if (orderedHeader == id)
      direction =
        order === HeaderDirection.NEXT
          ? HeaderDirection.PREV
          : HeaderDirection.NEXT;
    setOrderedHeader(id);
    setOrder(direction);
    onChange({ column, direction });
  };

  return headers.map((title, id) => (
    <th key={title} className="px-3 py-3" scope="col">
      <button
        className="grid grid-cols-2 place-content-between w-full"
        onClick={() => onClick(title, id)}
      >
        <div className="text-start">{firstUppercase(title)}</div>
        <div className="text-end">
          {icon[orderedHeader === id ? order : ""]}
        </div>
      </button>
    </th>
  ));
};

export default Header;
