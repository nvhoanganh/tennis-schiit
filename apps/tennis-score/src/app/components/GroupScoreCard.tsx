import formatDistanceToNow from "date-fns/formatDistanceToNow";
import {
  faUserCircle,
  faSortAmountUp,
  faSortAmountDown
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import groups from "libs/redux/src/lib/reducers/groupsReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const GroupScoreCard = ({
  group: { played, players, lastMatch, owner },
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
      {user && owner === user.uid ? (
        <span className="badge badge-warning ml-1">Owner</span>
      ) : null}

      {user && players[user.uid] ? (
        <span className="badge badge-success ml-1">Member</span>
      ) : null}
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
