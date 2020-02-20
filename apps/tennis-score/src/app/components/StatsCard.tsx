import React from "react";

export function StatsCard({ icon, number, name, ...props }) {
  return (
    <div className={"card shadow-sm " + props.cardClass}>
      <div className="card-content">
        <div className="card-body">
          <div className="media d-flex">
            <div className="align-self-center">{icon}</div>
            <div className="media-body text-right">
              <h3>{number}</h3>
              <span>{name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
