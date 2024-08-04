import React from "react";
import PropTypes from "prop-types";

const Button = ({ onClick, title }) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 p-2 rounded-lg text-white"
      onClick={() => onClick()}
    >
      {title}
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func,
  title: PropTypes.string,
};

export default Button;
