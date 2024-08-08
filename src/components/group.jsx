import React from "react";
import PropTypes from "prop-types";
const Group = ({ title, children }) => (
  <div className="border border-black dark:border-white m-2 rounded-lg p-2">
    {title && <span className="text-2xl">{title}</span>}
    {children}
  </div>
);
Group.propTypes = {
  children: PropTypes.element,
  title: PropTypes.string,
};
export default Group;
