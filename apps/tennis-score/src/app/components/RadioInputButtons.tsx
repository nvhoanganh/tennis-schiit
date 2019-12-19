import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";

const RadioInputButton: React.SFC<{
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
    console.log("value", value);
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
      <div className="btn-group btn-group-toggle w-100" data-toggle="buttons">
        {options.map(i => (
          <label
            className={"btn btn-light" + (value === i ? " active" : "")}
            key={i}
          >
            <input
              type="radio"
              onChange={e => setValue(name, e.target.value)}
              checked={value === i}
              value={i}
            />{" "}
            {i}
          </label>
        ))}
        <div className="invalid-feedback">{errorMessage}</div>
      </div>
    </div>
  );
};
export default RadioInputButton;
