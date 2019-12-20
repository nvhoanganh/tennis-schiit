import formatDistanceToNow from "date-fns/formatDistanceToNow";
import React from "react";
const GroupScoreCard = ({
  group: { played, players, lastMatch, owner },
  user
}) => {
  return (
    <div>
      <div>
        <span className="text-dark p-1 font-weight-bold">{Object.values(players).length}</span> Players,
        <span className="text-dark p-1 font-weight-bold">{played}</span> Matches, Last Match
        <span className="text-dark p-1 font-weight-bold">{formatDistanceToNow(lastMatch.toDate(), { addSuffix: true })}</span>
      </div>
    </div>
  );
};

export default GroupScoreCard;
