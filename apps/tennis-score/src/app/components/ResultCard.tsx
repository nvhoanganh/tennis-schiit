import { formatDistanceToNow } from "date-fns";
import React from "react";

const getHeadStartText = val => {
  switch (+val) {
    case 0.15:
      return "Head Start: 15pt for winning team";
    case 1:
      return "Head Start: 1 game for winning team";
    case 1.15:
      return "Head Start: 1 game + 15pt for winning team";
    case 2:
      return "Head Start: 2 games for winning team";
    case 2.15:
      return "Head Start: 2 game + 15pt for winning team";
    case 0.3:
      return "Head Start: 30pt for winning team";

    case -0.15:
      return "Head Start: 15pt for losing team";
    case -1:
      return "Head Start: 1 game for losing team";
    case -1.15:
      return "Head Start: 1 game + 15pt for losing team";
    case -2:
      return "Head Start: 2 games for losing team";
    case -2.15:
      return "Head Start: 2 game + 15pt for losing team";
    case -0.3:
      return "Head Start: 30pt for losing team";

    default:
      return "";
  }
};
const ResultCard = props => {
  const {
    group,
    winners,
    losers,
    headStart,
    gameWonByLostTeam,
    reverseBagel,
    matchDate,
    players
  } = props;
  const getPlayers = p => {
    const keys = Object.keys(p);
    return keys.length === 1 ? (
      <span>{players[keys[0]] ? players[keys[0]].name : "NA"}</span>
    ) : (
      <span>
        {players[keys[0]] ? players[keys[0]].name : "NA"}/
        {players[keys[1]] ? players[keys[1]].name : "NA"}
      </span>
    );
  };
  return (
    <div className="d-flex justify-content-between pb-1 border-bottom">
      <div className="p-2">
        <div>
          {getPlayers(winners)}{" "}
          <em className="text-muted font=weight-bold">def.</em>{" "}
          {getPlayers(losers)}
        </div>
        {headStart ? (
          <div>
            <span className="x-small text-info ml-0">
              {getHeadStartText(headStart)}
            </span>
            {gameWonByLostTeam === "0" && (
              <span className="badge x-small badge-warning ml-1">Bagel</span>
            )}
            {reverseBagel && (
              <span className="badge x-small badge-danger ml-1">R-Bagel</span>
            )}
          </div>
        ) : null}
        <div>
          <em className="text-muted x-small">
            {formatDistanceToNow(matchDate.toDate(), {
              addSuffix: true
            })}
          </em>
        </div>
      </div>
      <div className="pl-0 pr-0 align-self-center">
        <span className="h6">
          {gameWonByLostTeam === "6" || gameWonByLostTeam === "5" ? "7" : "6"} -{" "}
          {gameWonByLostTeam}
        </span>
      </div>
    </div>
  );
};

export default ResultCard;
