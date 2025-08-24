import React from "react";

type Props = {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  title: string;
};

const Button = ({ onClick, title }: Props) => {
  return (
    <button
      className="bg-purple-900-alt hover:bg-purple-900 active:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-300 p-2 rounded-lg text-white"
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default Button;
