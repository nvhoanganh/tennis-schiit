import React from "react";
export function ScoreCard({ played, won, lost, bagelWon, bagelLost }) {
  return (
    <div>
      <div>
        Played:
        <span className="text-dark p-1 font-weight-bold">{played}</span> W
        <span className="text-success p-1 font-weight-bold">{won}</span> L
        <span className="text-danger p-1 font-weight-bold">{lost}</span>
      </div>
      <div>
        Bagel: W
        <span className="text-success p-1 font-weight-bold">{bagelWon}</span> L
        <span className="text-danger p-1 font-weight-bold">{bagelLost}</span>
      </div>
    </div>
  );
}
