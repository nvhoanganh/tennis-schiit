import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState, useEffect } from "react";
import classNames from "classnames";

const FloatingFileInput = ({
  label,
  disabled,
  name,
  isValid,
  setValue,
  errorMessage,
  icon
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [className, setClassName] = useState("");
  useEffect(() => {
    inputRef.current.setCustomValidity(!isValid ? "weak" : "");
    setClassName(
      classNames({
        "is-invalid": !isValid
      })
    );
  }, [isValid]);
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        display: "inline-block",
        top: 74,
        right: 38
      }}
    >
      <button
        type="button"
        style={{
          border: "4px solid white",
          color: "white",
          backgroundColor: "#007bff",
          padding: "8px 8px",
          borderRadius: "23px",
          fontSize: "16px",
          fontWeight: "bold"
        }}
      >
        <FontAwesomeIcon icon={icon} />
      </button>
      <input
        type="file"
        disabled={disabled}
        name={name}
        ref={inputRef}
        className={className}
        onChange={e => setValue(name, e.target.files[0])}
        style={{
          fontSize: "30px",
          position: "absolute",
          left: 0,
          top: 0,
          opacity: 0
        }}
      />
    </div>
  );
};
export default FloatingFileInput;
