import React from "react";
export function ScoreCard({ played, won, lost, bagelWon, bagelLost }) {
  return (
    <div>
      <div className="badge badge-light">
        Played
        <span className="badge badge-dark ml-1">{played}</span> Won
        <span className="badge badge-success ml-1">{won}</span> Lost
        <span className="badge badge-danger ml-1">{lost}</span>
      </div>
      <div className="badge badge-light">
        Bagel: Win
        <span className="badge badge-success ml-1">{bagelWon}</span> Lost
        <span className="badge badge-danger ml-1">{bagelLost}</span>
      </div>
    </div>
  );
}
