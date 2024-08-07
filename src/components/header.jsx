import React, { useState } from "react";
import { firstUppercase } from "@/Utils/strings";
import PropTypes from "prop-types";

const icon = {
  next: <>&#x2193;</>,
  prev: <>&#x2191;</>,
  _: null,
};

const Header = ({ headers, onChange }) => {
  const [orderedHeader, setOrderedHeader] = useState(0);
  const [order, setOrder] = useState("next");

  const onClick = (column, id) => {
    let direction = null;
    if (orderedHeader == id) direction = order === "next" ? "prev" : "next";
    else direction = "next";
    setOrderedHeader(id);
    setOrder(direction);
    onChange({ column, direction: direction });
  };

  return headers.map((title, id) => (
    <th key={title}>
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

Header.propTypes = {
  headers: PropTypes.array,
  onChange: PropTypes.func,
};
export default Header;
