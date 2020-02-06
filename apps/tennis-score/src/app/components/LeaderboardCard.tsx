import { Avatar, AvatarBadge } from "@chakra-ui/core";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getUrlAvatar,
  SORT_PRIZEMONEY,
  SORT_TRUESKILL,
  SORT_WINPERCENT
} from "@tennis-score/redux";
import classNames from "classnames";
import React from "react";
import Skeleton from "react-loading-skeleton";
import Ripples from "react-ripples";
import { ScoreCard } from "./ScoreCard";

const prizeMoneyCls = player =>
  classNames({
    h6: true,
    "text-success": player.prizeMoney > 0,
    "text-danger": player.prizeMoney < 0
  });

const top3 = ranking =>
  ranking === 0
    ? "yellow.300"
    : ranking === 1
    ? "gray.300"
    : ranking === 2
    ? "yellow.600"
    : "";
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

const LeaderboardCard = ({ player, ranking, history, ...props }) => {
  if (props.loading) {
    return (
      <div className="px-2 border-bottom border-top">
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
    <div className="px-2 border-top">
      <Ripples
        className="w-100"
        onClick={() => setTimeout(() => history.push(getUserLink()), 200)}
      >
        <div className="card-body px-0 pt-3 pb-1">
          <div className="float-left pr-3">
            <Avatar
              size="md"
              name={player.name}
              src={getUrlAvatar(player.linkedplayerId || player.id)}
            >
              {top3(ranking) && <AvatarBadge size="1em" bg={top3(ranking)} />}
            </Avatar>
          </div>

          <div className="mr-auto">
            <span className="h5 text-dark pl-0">
              {player.name}
              {!player.linkedplayerId && (
                <span className="badge x-small badge-light ml-1 x-small">
                  G
                </span>
              )}
            </span>
            {player.played ? (
              <div className="float-right text-right">
                {getStats(player, props.sortBy)}
              </div>
            ) : null}
            <ScoreCard {...player} />
          </div>
        </div>
      </Ripples>
    </div>
  );
};

export default LeaderboardCard;
