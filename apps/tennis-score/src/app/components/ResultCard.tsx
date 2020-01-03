import { formatDistanceToNow } from "date-fns";
import React from "react";

const getHeadStartText = val => {
  switch (+val) {
    case 0.15:
      return "Handicap: 15pt for winning team";
    case 1:
      return "Handicap: 1 game for winning team";
    case 1.15:
      return "Handicap: 1 game + 15pt for winning team";
    case 2:
      return "Handicap: 2 games for winning team";
    case 2.15:
      return "Handicap: 2 game + 15pt for winning team";
    case 0.3:
      return "Handicap: 30pt for winning team";

    case -0.15:
      return "Handicap: 15pt for losing team";
    case -1:
      return "Handicap: 1 game for losing team";
    case -1.15:
      return "Handicap: 1 game + 15pt for losing team";
    case -2:
      return "Handicap: 2 games for losing team";
    case -2.15:
      return "Handicap: 2 game + 15pt for losing team";
    case -0.3:
      return "Handicap: 30pt for losing team";

    default:
      return "";
  }
};

const getHeadStartWinner = headStart =>
  headStart && headStart.toString() !== "0" && !headStart.startsWith("-")
    ? headStart
    : "";

const getHeadStartLoser = headStart =>
  headStart && headStart.toString() !== "0" && headStart.startsWith("-")
    ? headStart
    : "";
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
    <div className="d-flex justify-content-between pb-1 border-bottom pr-2 shadow-sm">
      <div className="p-2">
        <div>
          <span className="text-success mr-2">W:</span>
          {getPlayers(winners)}{" "}
          {getHeadStartWinner(headStart) && (
            <span className="badge x-small badge-success ml-1">
              {getHeadStartWinner(headStart)}
            </span>
          )}
          <br />
          <span className="text-danger mr-2" style={{ paddingRight: 8 }}>
            L:
          </span>
          {getPlayers(losers)}
          {getHeadStartLoser(headStart) && (
            <span className="badge x-small badge-success ml-1">
              {getHeadStartLoser(headStart).replace("-", "")}
            </span>
          )}
        </div>
        <div>
          <em className="text-muted x-small">
            {formatDistanceToNow(matchDate.toDate(), {
              addSuffix: true
            })}
            {gameWonByLostTeam === "0" && (
              <span className="badge x-small badge-warning ml-1">Bagel</span>
            )}
            {reverseBagel && (
              <span className="badge x-small badge-danger ml-1">R-Bagel</span>
            )}
          </em>
        </div>
      </div>
      <div className="pl-0 pr-0 align-self-center">
        <span className="h6 text-nowrap">
          {gameWonByLostTeam === "6" || gameWonByLostTeam === "5" ? "7" : "6"} -{" "}
          {gameWonByLostTeam}
        </span>
      </div>
    </div>
  );
};

export default ResultCard;
