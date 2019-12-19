import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";

const RadioInput: React.SFC<{
  label: string;
  name: string;
  value: any;
  isValid?: boolean;
  errorMessage: string;
  disabled?: boolean;
  options: any[];
  setValue(name: string, value: string);
}> = ({
  label,
  disabled,
  name,
  value,
  isValid,
  setValue,
  options,
  errorMessage
}) => {
  const [className, setClassName] = useState("form-control");
  useEffect(() => {
    console.log("opions", options);
    setClassName(
      classNames({
        "form-control": true,
        "is-invalid": !isValid
      })
    );
  }, [isValid]);

  return (
    <div className="form-group">
      <div className="mb-1">{label}</div>
      {[0, 1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name={name}
            value={i}
          />
          <label className="form-check-label" htmlFor={"inlineRadio" + i}>
            {i}
          </label>
        </div>
      ))}
      <div className="invalid-feedback">{errorMessage}</div>
    </div>
  );
};
export default RadioInput;
