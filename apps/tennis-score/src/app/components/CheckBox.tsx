import React from "react";

const checkBoxStyle = {
  height: 30,
  marginTop: 3
};
export function CheckBox({ value, large, ...props }) {
  return (
    <input
      className="form-control"
      style={large ? checkBoxStyle : null}
      type="checkbox"
      value={value}
      {...props}
    />
  );
}
