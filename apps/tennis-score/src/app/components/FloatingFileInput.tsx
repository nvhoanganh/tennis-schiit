import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState, useEffect } from "react";
import classNames from "classnames";
import { Button } from "@chakra-ui/core";

const FloatingFileInput = ({
  disabled,
  name,
  isValid,
  setValue,
  errorMessage,
  button
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
    <div>
      {button}
      <input
        type="file"
        disabled={disabled}
        name={name}
        ref={inputRef}
        className={className}
        onChange={e => setValue(name, e.target.files[0])}
        style={{
          position: "absolute",
          left: 0,
          opacity: 0
        }}
      />
    </div>
  );
};
export default FloatingFileInput;
