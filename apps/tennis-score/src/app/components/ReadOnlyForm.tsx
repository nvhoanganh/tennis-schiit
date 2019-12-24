import React from "react";
export function ReadOnlyForm({ label, value }) {

  return (
    <div className="row">
      <label htmlFor="owner" className="col-3 col-form-label">
        {label}
      </label>
      <div className="col-9">
        <input
          type="text"
          readOnly
          className="form-control-plaintext font-weight-bold"
          id="staticEmail"
          value={value}
        />
      </div>
    </div>
  );
}
