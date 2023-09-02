import React, { useState } from "react";
import "./styles/TodoButtons.css"; // Import your CSS file

const TodoButton = ({ name = "Todo Button", passwordMatched = true }) => {
  // to handlet the mouse move event
  const [x, setX] = useState(0);

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const newX = e.clientX * 3 - rect.left;
    setX(newX);
  };

  const buttonStyle = {
    "--x": `${x}deg`,
  };

  return (
    <button
      className={`todo-button mt-2 rounded w-full border-2 px-6 py-2 font-semibold ${
        passwordMatched
          ? "border-green-500 text-green-500 active:bg-green-300 active:text-gray-600"
          : "border-gray-400 text-gray-400 cursor-not-allowed"
      } text-lg`}
      onMouseMove={handleMouseMove}
      style={buttonStyle}
    >
      <i></i>
      <i></i>
      <span>Button</span>
    </button>
  );
};

export default TodoButton;
