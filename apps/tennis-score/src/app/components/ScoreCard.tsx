import React from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
export function ScoreCard({
  played,
  won,
  lost,
  lastMatch,
  bagelWon,
  bagelLost
}) {
  return (
    <div>
        <small className="d-block">
          {lastMatch ? formatDistanceToNow(lastMatch.toDate(), {
            addSuffix: true
          }) : "-"}
        </small>
      <small>
        <span className="text-dark font-weight-bold">{played || "0"}</span>(
        <span className="text-success font-weight-bold">{won || "0"}</span>/
        <span className="text-danger font-weight-bold">{lost || "0"}</span>)
        {" - Bagel:"}
        <span className="text-success font-weight-bold">{bagelWon || "0"}</span>
        /
        <span className="text-danger font-weight-bold">{bagelLost || "0"}</span>
      </small>
    </div>
  );
}
