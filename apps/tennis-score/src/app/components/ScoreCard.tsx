import React from "react";
export function ScoreCard({ played, won, lost, bagelWon, bagelLost }) {
  return (
    <div>
      <div>
        W/L:{" "}
        <span className="text-success p-1 font-weight-bold">{won}</span>/
        <span className="text-danger p-1 font-weight-bold">{lost}</span>{"  "}
        Bagel:{" "}
        <span className="text-success p-1 font-weight-bold">{bagelWon}</span>/
        <span className="text-danger p-1 font-weight-bold">{bagelLost}</span>
      </div>
      <div>
        <span className="text-dark font-weight-bold">{played}</span> matches
      </div>
    </div>
  );
}
