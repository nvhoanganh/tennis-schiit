import formatDistanceToNow from "date-fns/formatDistanceToNow";
import React from "react";
const GroupScoreCard = ({
  group: { played, lastMatch, owner },
  players,
  user
}) => {
  return (
    <div
      style={{
        marginTop: -5
      }}
    >
      {lastMatch && (
        <div>
          <em className="text-muted" style={{ fontSize: "0.7rem" }}>
            Last match:{" "}
            {formatDistanceToNow(lastMatch.toDate(), { addSuffix: true })}
          </em>
        </div>
      )}
      <div>
        <span className="text-dark font-weight-bold">
          {(players || []).length}
        </span>{" "}
        players, <span className="text-dark font-weight-bold">{played}</span>{" "}
        matches
      </div>
    </div>
  );
};

export default GroupScoreCard;
