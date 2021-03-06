import React from "react";

const RadioInputButton: React.SFC<{
  label: string;
  name: string;
  value: any;
  isValid?: boolean;
  errorMessage: string;
  disabled?: boolean;
  options: any[];
  setValue(name: string, value: string);
}> = ({ label, name, value, setValue, options, errorMessage }) => {
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
