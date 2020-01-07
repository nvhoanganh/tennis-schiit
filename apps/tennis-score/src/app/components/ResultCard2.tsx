import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { getHandyCap } from "@tennis-score/redux";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { LinkContainer } from "react-router-bootstrap";
import { DropDownMenu } from "./DropDownMenu";

const ResultCard = props => {
  const {
    groupId,
    winners,
    losers,
    headStart,
    gameWonByLostTeam,
    reverseBagel,
    matchDate,
    tournamentId,
    players
  } = props;
  const getPlayers = (p, isLoser) => {
    return Object.keys(p).map(x => (
      <span key={x} className={"d-block" + (isLoser ? " text-right" : "")}>
        <span className="pl-1">{players[x] ? players[x].name : "NA"}</span>
      </span>
    ));
  };
  return (
    <div className="d-flex border-bottom shadow-sm mx-1 my-2 justify-content-between">
      <div className="pl-1 w-100 flex-grow-1 align-self-center">
        {getPlayers(winners, false)}
      </div>

      <div className="p-2 text-center align-self-center score text-nowrap">
        <em className="h5">
          {gameWonByLostTeam === "6" || gameWonByLostTeam === "5" ? "7" : "6"} -{" "}
          {gameWonByLostTeam}
        </em>
        <em className="text-muted d-block x-small">
          {formatDistanceToNow(matchDate.toDate(), {
            addSuffix: true
          })}
        </em>
        <span className="text-nowrap">
          {headStart ? (
            <span className="badge x-small badge-success">
              {getHandyCap(headStart)}
            </span>
          ) : null}
          {gameWonByLostTeam === "0" && (
            <span className="badge x-small badge-warning ml-1">B</span>
          )}
          {reverseBagel && (
            <span className="badge x-small badge-danger ml-1">RB</span>
          )}
        </span>
      </div>

      <div className="pl-1 w-100 flex-grow-1 align-self-center">
        {getPlayers(losers, true)}
      </div>
      <div className="p-1 align-self-center">
        <DropDownMenu
          icon={faEllipsisV}
          options={[
            <LinkContainer
              key="filter"
              to={`/headtohead/${groupId}/tournament/${tournamentId}?team1=${Object.keys(
                winners
              ).join("|")}&team2=${Object.keys(losers).join("|")}`}
            >
              <Dropdown.Item>View Head 2 Head</Dropdown.Item>
            </LinkContainer>
          ]}
        />
      </div>
    </div>
  );
};

export default ResultCard;
