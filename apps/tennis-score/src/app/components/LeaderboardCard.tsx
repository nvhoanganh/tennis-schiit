import {
  faSortAmountDown,
  faSortAmountUp,
  faEquals
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React from "react";
import Gravatar from "react-gravatar";
import { LinkContainer } from "react-router-bootstrap";
import { ScoreCard } from "./ScoreCard";
import RoundGravatar from "./RoundGravatar";

const LeaderboardCard = ({ player, ranking }) => {
  const prizeMoneyCls = classNames({
    h6: true,
    "text-success": player.prizeMoney > 0,
    "text-danger": player.prizeMoney < 0
  });

  const top3 = {
    backgroundColor:
      ranking === 0
        ? "gold"
        : ranking === 1
        ? "silver"
        : ranking === 2
        ? "chocolate"
        : ""
  };

  const getArrow =
    player.lastWeekscore > player.score ? (
      <FontAwesomeIcon icon={faSortAmountDown} className="pl-1 text-danger" />
    ) : player.lkastWeekscore < player.score ? (
      <FontAwesomeIcon icon={faSortAmountUp} className="pl-1 text-success" />
    ) : (
      <FontAwesomeIcon
        icon={faEquals}
        className="pl-1"
        style={{ color: "transparent" }}
      />
    );

  return (
    <div className="card mb-2">
      <div
        className="card-body"
        style={{
          margin: -9
        }}
      >
        <div className="float-left pr-2">
          <RoundGravatar size={60} email={player.email} />
          <div className="text-center">
            <span className="badge badge-pill " style={top3}>
              {ranking === 0
                ? "1st"
                : ranking === 1
                ? "2nd"
                : ranking === 2
                ? "3rd"
                : ""}
            </span>
          </div>
        </div>
        <div className="mr-auto">
          <LinkContainer to={`/player/${player.id}`}>
            <a className="h5 pl-1">{player.name}</a>
          </LinkContainer>
          <div className="float-right">
            <div className="h4">
              {player.score}
              {getArrow}
            </div>
            <div className="h6">{player.winPercentage}%</div>
            <div className={prizeMoneyCls}>${player.prizeMoney}</div>
          </div>
          <ScoreCard {...player} />
        </div>
      </div>
    </div>
  );
};

export default LeaderboardCard;
