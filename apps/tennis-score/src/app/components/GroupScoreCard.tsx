import formatDistanceToNow from "date-fns/formatDistanceToNow";
import React from "react";
const GroupScoreCard = ({
  group: { createdOn, location, played, lastMatch, owner },
  players,
  user
}) => {
  return (
    <div>
      <em className="d-block text-muted" style={{ fontSize: "0.7rem" }}>
        {location}
      </em>
      <em className="d-block text-muted" style={{ fontSize: "0.7rem" }}>
        Created{" "}
        {formatDistanceToNow(createdOn.toDate(), {
          addSuffix: true
        })}
      </em>
      {lastMatch && (
        <em className="d-block text-muted" style={{ fontSize: "0.7rem" }}>
          Last match:{" "}
          {formatDistanceToNow(lastMatch.toDate(), { addSuffix: true })}
        </em>
      )}
    </div>
  );
};

export default GroupScoreCard;
