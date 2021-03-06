import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";

const TextInput: React.SFC<{
  label: string;
  name: string;
  value: any;
  type: string;
  placeholder: string;
  isValid?: boolean;
  errorMessage: string;
  disabled?: boolean;
  setValue(name: string, value: string);
}> = ({
  label,
  disabled,
  name,
  value,
  placeholder,
  type,
  isValid,
  setValue,
  errorMessage
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dirty, setDirty] = useState(false);
  const [className, setClassName] = useState("form-control");
  useEffect(() => {
    inputRef.current.setCustomValidity(!isValid ? "weak" : "");
    setClassName(
      classNames({
        "form-control": true,
        "is-invalid": !isValid && dirty
      })
    );
  }, [isValid, dirty]);

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        disabled={disabled}
        name={name}
        ref={inputRef}
        autoComplete="off"
        className={className}
        onChange={e => {
          setValue(name, e.target.value);
          setDirty(true);
        }}
        value={value}
        placeholder={placeholder}
        type={type}
      />
      <div className="invalid-feedback">{errorMessage}</div>
    </div>
  );
};
export default TextInput;
