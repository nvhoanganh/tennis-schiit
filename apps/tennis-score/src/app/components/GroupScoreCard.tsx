import formatDistanceToNow from "date-fns/formatDistanceToNow";
import React from "react";
const GroupScoreCard = ({
  group: { played, players, lastMatch },
  fontSize,
  user
}) => {
  const props = {
    style: { fontSize: fontSize || "0.8rem" },
    type: "button",
    className: "btn btn-sm btn-default"
  };
  const iconS = { fontSize: "1.2rem" };
  return (
    <div>
      <span className="badge badge-primary">
        Players{" "}
        <span className="badge badge-light">
          {Object.values(players).length}
        </span>
      </span>
      <span className="badge badge-secondary ml-1">
        Played <span className="badge badge-light">{played}</span>
      </span>

      <span className="badge badge-warning ml-1">
        Last Match{" "}
        <span className="badge badge-light">
          {formatDistanceToNow(lastMatch.toDate(), { addSuffix: false })}
        </span>
      </span>

      {user && players[user.uid] ? (
        <span className="badge badge-success ml-1">
          Joined{" "}
          <span className="badge badge-light">
            {formatDistanceToNow(players[user.uid].toDate(), {
              addSuffix: false
            })}
          </span>
        </span>
      ) : null}
    </div>
  );
};

export default GroupScoreCard;
