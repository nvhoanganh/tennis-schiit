import formatDistanceToNow from "date-fns/formatDistanceToNow";
import React from "react";
const GroupScoreCard = ({
  group: { played, players, lastMatch, owner },
  user
}) => {
  return (
    <div>
      {lastMatch &&
        <div>
          <em className="text-muted" style={{ fontSize: "0.7rem" }}>
            Last match: {formatDistanceToNow(lastMatch.toDate(), { addSuffix: true })}
          </em>
        </div>
      }
      <div >
        <span className="text-dark font-weight-bold">{Object.values(players).length}</span> players, played{" "}
        <span className="text-dark font-weight-bold">{played}</span> matches{" "}
      </div>
    </div>
  );
};

export default GroupScoreCard;
