import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "./button";
const Group = ({ title, children, initialOpen = false }) => {
  const [isOpen, setOpen] = useState(initialOpen);
  return (
    <div className="border border-black dark:border-white m-2 rounded-lg p-2">
      <div className="flex justify-between">
        {title ? <span className="text-2xl">{title}</span> : <div></div>}
        <Button
          title={isOpen ? "Close" : "Open"}
          onClick={() => setOpen(!isOpen)}
        />
      </div>
      <div
        className={`transition-all overflow-hidden ease-in-out duration-500 ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};
Group.propTypes = {
  children: PropTypes.element,
  title: PropTypes.string,
  initialOpen: PropTypes.bool,
};
export default Group;
