import {
  faSortAmountDown,
  faSortAmountUp,
  faUserCircle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React from "react";
import Card from "react-bootstrap/Card";
import { LinkContainer } from "react-router-bootstrap";
import { ScoreCard } from "./ScoreCard";

const LeaderboardCard = ({ player, ranking }) => {
  const prizeMoneyCls = classNames({
    h6: true,
    "text-success": player.prizeMoney > 0,
    "text-danger": player.prizeMoney < 0
  });

  const getArrow =
    player.lastWeekscore > player.score ? (
      <FontAwesomeIcon icon={faSortAmountDown} className="pl-1 text-danger" />
    ) : player.lastWeekscore < player.score ? (
      <FontAwesomeIcon icon={faSortAmountUp} className="pl-1 text-success" />
    ) : null;

  return (
    <div className="card mb-2">
      <div className="card-body" style={{
        margin: -9,
      }}>
        <div className="float-left pr-2">
          <FontAwesomeIcon style={{ fontSize: "2rem" }} icon={faUserCircle} />
          <div>
            <span
              className="badge badge-pill "
              style={{
                backgroundColor:
                  ranking === 0
                    ? "gold"
                    : ranking === 1
                    ? "silver"
                    : ranking === 2
                    ? "chocolate"
                    : ""
              }}
            >
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
            <a className="h4 pl-0">{player.name}</a>
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
