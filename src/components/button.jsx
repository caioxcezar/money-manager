import React from "react";
import PropTypes from "prop-types";

const Button = ({ onClick, title }) => {
  return (
    <button
      className="bg-purple-900-alt hover:bg-purple-900 active:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-300 p-2 rounded-lg text-white"
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
