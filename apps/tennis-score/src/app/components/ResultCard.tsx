import React from "react";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LinkContainer } from "react-router-bootstrap";
import RoundGravatar from "./RoundGravatar";
import { formatDistanceToNow } from "date-fns";
import { Button } from "./Button";

const ResultCard = props => {
  const {
    group,
    winners,
    losers,
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
    <div className="d-flex justify-content-between pb-1">
      <div className="p-2">
        <div>
          {getPlayers(winners)} <em className="text-muted font=weight-bold">def.</em>{" "}
          {getPlayers(losers)}
        </div>
        <div>
          <em className="text-muted x-small">
            {formatDistanceToNow(matchDate.toDate(), {
              addSuffix: true
            })}
          </em>
          {gameWonByLostTeam === "0" && (
            <span className="badge x-small badge-warning ml-1">Bagel</span>
          )}
          {reverseBagel && (
            <span className="badge x-small badge-danger ml-1">R-Bagel</span>
          )}
        </div>
      </div>
      <div className="p-2 align-self-center">
        <span className="h5">
          {gameWonByLostTeam === "6" ? "7" : "6"} - {gameWonByLostTeam}
        </span>
      </div>
    </div>
  );
};

export default ResultCard;
