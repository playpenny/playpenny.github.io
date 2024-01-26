import React, { useState } from "react";
import Button from "react-bootstrap/Button";

export const AppButton = ({ text, onClick, disabled = false }) => {
  const [hover, setHover] = useState(false);

  const AppButtonStyles = {
    backgroundColor: disabled ? "#6c757d" : hover ? "#7fb3d5" : "#002855", // Grey if disabled, Lighter Blue on hover, Dark Blue by default
    color: "#ffffff", // White
    border: "none",
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "10px",
    cursor: disabled ? "not-allowed" : "pointer", // Change cursor if disabled
    marginTop: "8px",
    marginLeft: "8px",
    marginRight: "8px",
  };

  return (
    <Button
      onClick={onClick}
      style={AppButtonStyles}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      disabled={disabled}
    >
      {text}
    </Button>
  );
};

export const HintButton = ({ hint, setHardMode }) => {
  const [hover, setHover] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleClick = () => {
    setShowHint(true);
    setHardMode(false);
  };

  return (
    <Button
      onClick={handleClick}
      disabled={showHint}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      style={{
        backgroundColor: showHint ? "#6c757d" : hover ? "#7fb3d5" : "#002855",
        color: "#ffffff",
        border: "none",
        padding: "10px 20px",
        fontSize: "16px",
        borderRadius: "10px",
        marginTop: "8px",
        transition: "background-color 0.5s ease-in-out, color 0.5s ease-in-out",
        cursor: showHint ? "inherit" : "pointer",
        marginLeft: "4px",
        marginRight: "4px",
      }}
    >
      {showHint ? `Today's Hint: ${hint}` : "Show me a hint"}
    </Button>
  );
};
