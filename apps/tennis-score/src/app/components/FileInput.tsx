import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";

const FileInput: React.SFC<{
  label: string;
  name: string;
  isValid?: boolean;
  errorMessage: string;
  multiple: boolean;
  disabled?: boolean;
  setValue(name: string, value: any);
}> = ({
  label,
  disabled,
  name,
  isValid,
  setValue,
  errorMessage
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
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        disabled={disabled}
        name={name}
        multiple
        ref={inputRef}
        className={className}
        onChange={e => setValue(name, e.target.files[0])}
        type="file"
      />
      <div className="invalid-feedback">{errorMessage}</div>
    </div>
  );
};
export default FileInput;
