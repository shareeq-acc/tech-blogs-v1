import React from "react";
import "./button.css";
const Button = ({ theme, color, text, onClick, type, className }) => {

  const btnStyle = {
    color: `${color}`,
    backgroundColor: `${theme}`,
  };

  return (
    <button className={`btn ${className ? className : ""}`} style={btnStyle} type={type} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
