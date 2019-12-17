import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";

const SelectInput: React.SFC<{
  label: string;
  name: string;
  value: string;
  placeholder: string;
  isValid?: boolean;
  errorMessage: string;
  disabled?: boolean;
  options?: any[];
  setValue(name: string, value: string);
}> = ({
  label,
  disabled,
  name,
  value,
  placeholder,
  isValid,
  setValue,
  errorMessage,
  options
}) => {
  const inputRef = useRef<HTMLSelectElement>(null);
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
      <select
        disabled={disabled}
        name={name}
        ref={inputRef}
        className={className}
        onChange={e => setValue(name, e.target.value)}
        value={value}
        placeholder={placeholder}
      >
        {options.map(o => (
          <option value={o} key={o}>
            {o}
          </option>
        ))}
      </select>
      <div className="invalid-feedback">{errorMessage}</div>
    </div>
  );
};
export default SelectInput;
