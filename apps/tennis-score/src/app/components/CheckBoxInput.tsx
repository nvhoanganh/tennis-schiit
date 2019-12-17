import React from "react";

const checkBoxStyle = {
  height: 30,
  width: 30,
  marginTop: 3
};

const CheckBoxInput: React.SFC<{
  label: string;
  name: string;
  value: boolean;
  disabled?: boolean;
  setValue(name: string, value: boolean);
}> = ({ label, disabled, name, value, setValue }) => {
  return (
    <div className="form-check">
      <input
        disabled={disabled}
        name={name}
        style={checkBoxStyle}
        className="form-check-input"
        onChange={e => setValue(name, e.target.checked)}
        checked={value}
        type="checkbox"
      />
      <label
        className="form-check-label"
        htmlFor={name}
        style={{
          marginLeft: 20
        }}
      >
        {label}
      </label>
    </div>
  );
};
export default CheckBoxInput;
