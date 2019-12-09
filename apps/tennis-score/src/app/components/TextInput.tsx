import React, { useEffect, useRef, useState } from "react";
const classNames = require("classnames");

const TextInput: React.SFC<{
  label: string;
  name: string;
  value: string;
  type: string;
  placeholder: string;
  isValid?: boolean;
  errorMessage: string;
  setValue(val: string);
}> = ({
  label,
  name,
  value,
  placeholder,
  type,
  isValid,
  setValue,
  errorMessage
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [className, setClassName] = useState("form-control");
  useEffect(() => {
    inputRef.current.setCustomValidity(!isValid ? "weak" : "");
    setClassName(
      classNames({
        "form-control": true,
        "is-invalid": !isValid
      })
    );
  }, [isValid]);

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        name={name}
        ref={inputRef}
        autoComplete="off"
        className={className}
        onChange={e => {
          e.preventDefault();
          setValue(e.target.value);
        }}
        value={value}
        placeholder={placeholder}
        type={type}
      />
      {<div className="invalid-feedback">{errorMessage}</div>}
    </div>
  );
};
export default TextInput;
