import React from "react";

export const Button = ({ disabled, children }) => (
  <button
    disabled={disabled}
    type="submit"
    className="btn btn-primary btn-block"
  >
    {children}
  </button>
);
