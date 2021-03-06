import { Avatar, AvatarBadge } from "@chakra-ui/core";
import {
  getUrlAvatar,
  SORT_PRIZEMONEY,
  SORT_WINPERCENT,
  SORT_GAMEDIFFERENCE_AVG,
  SORT_GAMEDIFFERENCE,
  SORT_TOTALGAMEWON,
  SORT_GAMEWON_AVG
} from "@tennis-score/redux";
import classNames from "classnames";
import React from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import Ripples from "react-ripples";
import { ScoreCard } from "./ScoreCard";

// helper methods
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
    <FaChevronDown className={arrowClass + "text-danger d-inline"} />
  ) : player.previousScore < player.score ? (
    <FaChevronUp className={arrowClass + "text-success d-inline"} />
  ) : null;

const Stats = ({ player, sortBy, showPrize }) => {
  const Point = ({ showChange }) => (
    <div className="h6">
      {showChange && getArrow(player)}
      {player.score}
      <sup>pt</sup>
    </div>
  );

  const PointAvg = ({ showChange }) => (
    <div className="h6">
      {showChange && getArrow(player)}
      {player.scoreAvg.toFixed(2)}
      <sup>pm</sup>
    </div>
  );

  const Percentage = () => (
    <div className="h6">
      {player.winPercentage}
      <sup>%</sup>
    </div>
  );

  const Money = () => (
    <div className={prizeMoneyCls(player)}>
      {player.prizeMoney}
      <sup>$</sup>
    </div>
  );

  switch (sortBy) {
    case SORT_PRIZEMONEY:
      return (
        <>
          {showPrize ? <Money /> : null} <Percentage />{" "}
          <Point showChange={false} />
        </>
      );
    case SORT_WINPERCENT:
      return (
        <>
          <Percentage /> {showPrize ? <Money /> : null}{" "}
          <Point showChange={false} />
        </>
      );

    case SORT_TOTALGAMEWON:
    case SORT_GAMEDIFFERENCE:
      return (
        <>
          <Point showChange /> <Percentage /> <PointAvg showChange={false} />
        </>
      );

    case SORT_GAMEWON_AVG:
    case SORT_GAMEDIFFERENCE_AVG:
      return (
        <>
          <PointAvg showChange /> <Percentage /> <Point showChange={false} />
        </>
      );
    default:
      return (
        <>
          <Point showChange /> <Percentage /> {showPrize ? <Money /> : null}
        </>
      );
  }
};

// component
const LeaderboardCard = ({ player, ranking, history, ...props }) => {
  if (props.loading) {
    return (
      <div className="px-2 border-bottom">
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
    <div className="px-2 border-bottom">
      <Ripples
        className="w-100"
        onClick={() => setTimeout(() => history.push(getUserLink()), 200)}
      >
        <div className="card-body px-0 pt-3 pb-1">
          <div className="float-left pr-3">
            <Avatar
              size="md"
              name={player.name}
              src={player.avatarUrl ? getUrlAvatar(player.linkedplayerId) : ""}
            >
              {top3(ranking) && <AvatarBadge size="1em" bg={top3(ranking)} />}
            </Avatar>
          </div>

          <div className="mr-auto">
            <a
              className="h5 text-dark pl-0 player__name"
              onClick={() => setTimeout(() => history.push(getUserLink()), 200)}
            >
              {player.name}
              {!player.linkedplayerId && (
                <span className="badge x-small badge-light ml-1 x-small">
                  G
                </span>
              )}
            </a>
            {player.played ? (
              <div className="float-right text-right">
                <Stats
                  player={player}
                  sortBy={props.sortBy}
                  showPrize={props.showPrize}
                />
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
