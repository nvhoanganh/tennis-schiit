import formatDistanceToNow from "date-fns/formatDistanceToNow";
import React from "react";
const GroupScoreCard = ({
  group: { played, players, lastMatch, owner },
  user
}) => {
  return (
    <div>
      
      <span className="badge badge-primary ml-1">
        <span className="badge badge-light">
          {Object.values(players).length}
        </span>{" "}
        Players
      </span>
      <span className="badge badge-secondary ml-1">
        <span className="badge badge-light">{played}</span> Matches
      </span>

      <span className="badge badge-warning ml-1">
        Played{" "}
        <span className="badge badge-light">
          {formatDistanceToNow(lastMatch.toDate(), { addSuffix: true })}
        </span>
      </span>
    </div>
  );
};

export default GroupScoreCard;
