import React from "react";
export function ScoreCard({ played, won, lost, bagelWon, bagelLost }) {
  return (
    <div>
      <div>
        W/L:{" "}
        <span className="text-success p-1 font-weight-bold">{won || "0"}</span>/
        <span className="text-danger p-1 font-weight-bold">{lost || "0"}</span>
        {"  "}
        Bagel:{" "}
        <span className="text-success p-1 font-weight-bold">
          {bagelWon || "0"}
        </span>
        /
        <span className="text-danger p-1 font-weight-bold">
          {bagelLost || "0"}
        </span>
      </div>
      <div>
        <span className="text-dark font-weight-bold">{played || "0"}</span>{" "}
        matches
      </div>
    </div>
  );
}
