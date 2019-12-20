import formatDistanceToNow from "date-fns/formatDistanceToNow";
import React from "react";
const GroupScoreCard = ({
  group: { played, players, lastMatch, owner },
  user
}) => {
  return (
    <div>
      <div>
        <span className="text-dark font-weight-bold">{Object.values(players).length}</span> players,{" "}
        <span className="text-dark font-weight-bold">{played}</span> matches played{" "}
        {lastMatch && <span className="text-dark">({formatDistanceToNow(lastMatch.toDate(), { addSuffix: true })})</span>}
      </div>
    </div>
  );
};

export default GroupScoreCard;
