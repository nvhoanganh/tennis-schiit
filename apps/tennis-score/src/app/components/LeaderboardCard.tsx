import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React from "react";
import Skeleton from "react-loading-skeleton";
import { LinkContainer } from "react-router-bootstrap";
import RoundGravatar from "./RoundGravatar";
import { ScoreCard } from "./ScoreCard";
import {
  SORT_PRIZEMONEY,
  SORT_TRUESKILL,
  SORT_WINPERCENT
} from "@tennis-score/redux";

const prizeMoneyCls = player =>
  classNames({
    h6: true,
    "text-success": player.prizeMoney > 0,
    "text-danger": player.prizeMoney < 0
  });

const top3 = ranking => ({
  backgroundColor:
    ranking === 0
      ? "gold"
      : ranking === 1
      ? "silver"
      : ranking === 2
      ? "chocolate"
      : ""
});
const arrowClass = "pl-1 h6 align-middle mr-1 h6 ";
const getArrow = player =>
  player.previousScore > player.score ? (
    <FontAwesomeIcon
      icon={faChevronDown}
      className={arrowClass + "text-danger"}
    />
  ) : player.previousScore < player.score ? (
    <FontAwesomeIcon
      icon={faChevronUp}
      className={arrowClass + "text-success"}
    />
  ) : null;

const getStats = (player, sortBy) => {
  const point = (
    <div className="h6">
      {getArrow(player)}
      {player.score}
      <sup>pt</sup>
    </div>
  );
  const pct = (
    <div className="h6">
      {player.winPercentage}
      <sup>%</sup>
    </div>
  );

  const money = (
    <div className={prizeMoneyCls(player)}>
      {player.prizeMoney}
      <sup>$</sup>
    </div>
  );

  switch (sortBy) {
    case SORT_PRIZEMONEY:
      return (
        <>
          {money} {pct} {point}
        </>
      );
    case SORT_TRUESKILL:
      return (
        <>
          {point} {pct} {money}
        </>
      );
    case SORT_WINPERCENT:
      return (
        <>
          {pct} {money} {point}
        </>
      );
  }
  return (
    <>
      <div className="h6">
        {getArrow(player)}
        {player.score}
        <sup>pt</sup>
      </div>
      <div className="h6">
        {player.winPercentage}
        <sup>%</sup>
      </div>
      <div className={prizeMoneyCls(player)}>
        {player.prizeMoney}
        <sup>$</sup>
      </div>
    </>
  );
};

const LeaderboardCard = ({ player, ranking, ...props }) => {
  if (props.loading) {
    return (
      <div className="col-sm-6 col-md-4 col-lg-3 border-bottom border-top">
        <div className="pl-0 py-3">
          <div>
            <a className="h5 text-dark pl-0">
              <Skeleton />
            </a>
            <Skeleton height={60} />
          </div>
        </div>
      </div>
    );
  }
  const getUserLink = () =>
    `/group/${props.group.groupId}/player/${player.id}?userId=${player.linkedplayerId}`;
  return (
    <div className="col-sm-6 col-md-4 col-lg-3 border-bottom border-top shadow-sm">
      <div className="card-body py-3 px-0">
        <LinkContainer to={getUserLink()}>
          <div className="float-left pr-3">
            <RoundGravatar
              size={50}
              avatarUrl={player.avatarUrl}
              email={player.email || "0"}
            />
            <div className="text-center">
              <span className="badge badge-pill " style={top3(ranking)}>
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
        </LinkContainer>

        <div className="mr-auto">
          <LinkContainer to={getUserLink()}>
            <a className="h5 text-dark pl-0">
              {player.name}
              {!player.linkedplayerId && (
                <span className="badge x-small badge-light ml-1 x-small">
                  G
                </span>
              )}
            </a>
          </LinkContainer>
          {player.played ? (
            <div className="float-right text-right">
              {getStats(player, props.sortBy)}
            </div>
          ) : null}
          <ScoreCard {...player} />
        </div>
      </div>
    </div>
  );
};

export default LeaderboardCard;
