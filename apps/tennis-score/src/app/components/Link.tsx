import React from "react";

export const Link = ({ children, ...props }) => (
  <a className="small"  {...props}>
    {children}
  </a>
);
