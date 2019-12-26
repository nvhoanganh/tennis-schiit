import {
  faSortAmountDown,
  faSortAmountUp,
  faEquals,
  faChevronDown,
  faChevronUp
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
  const arrowClass = "pl-1 h6 align-middle mr-1 h6 ";
  const getArrow =
    player.lastWeekscore > player.score ? (
      <FontAwesomeIcon
        icon={faChevronDown}
        className={arrowClass + "text-danger"}
      />
    ) : player.lastWeekscore < player.score ? (
      <FontAwesomeIcon
        icon={faChevronUp}
        className={arrowClass + "text-success"}
      />
    ) : null;
  console.log(player);
  return (
    <LinkContainer to={`/player/${player.id}`}>
      <div className="col-sm-6 col-md-4 col-lg-3 border-bottom">
        <div className="card-body pl-0 py-3">
          <div className="float-left pr-3 pl-0">
            <RoundGravatar size={50} email={player.email || "0"} />
            <div className="text-center">
              <span className="badge badge-pill " style={top3}>
                {ranking === 0
                  ? "1st"
                  : ranking === 1
                  ? "2nd"
                  : ranking === 2
                  ? "3rd"
                  : " "}
              </span>
            </div>
          </div>
          <div className="mr-auto">
            <a className="h5 text-dark pl-0">{player.name}</a>
            {player.played ? (
              <div
                className="float-right text-right"
                style={{ position: "relative", right: -23 }}
              >
                <div className="h4">
                  {getArrow}
                  {player.score}
                  <sup style={{ fontSize: "0.7rem", top: "-1rem" }}>pt</sup>
                </div>
                <div className="h6">
                  {player.winPercentage}
                  <sup>%</sup>
                </div>
                <div className={prizeMoneyCls}>
                  {player.prizeMoney}
                  <sup>$</sup>
                </div>
              </div>
            ) : null}
            <ScoreCard {...player} />
          </div>
        </div>
      </div>
    </LinkContainer>
  );
};

export default LeaderboardCard;
