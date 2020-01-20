import React from "react";
export function ScrollPills({ children, height }) {
  return (
    <div
      className="container-fluid border div1 shadow-sm pr-2"
      style={{
        width: "100%",
        overflow: "hidden"
      }}
    >
      <div
        className="row flex-nowrap p-2 div2"
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          marginBottom: "10px !important"
        }}
      >
        {children}
      </div>
    </div>
  );
}
