import {
  faFrown,
  faSmile,
  faEllipsisH,
  faEllipsisV
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { LinkContainer } from "react-router-bootstrap";
import { DropDownMenu } from "./DropDownMenu";

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
    groupId,
    winners,
    losers,
    headStart,
    gameWonByLostTeam,
    reverseBagel,
    matchDate,
    tournamentId,
    players,
    showHead2Head
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
      <div className="flex-grow-1 d-flex">
        <div className="p-2 flex-grow-1">
          <div>
            <div>
              <FontAwesomeIcon className="text-success mr-2" icon={faSmile} />
              {getPlayers(winners)}{" "}
              {getHeadStartWinner(headStart) && (
                <span
                  className="badge x-small badge-success"
                  style={{
                    top: "-0.3rem",
                    marginLeft: -2,
                    position: "relative"
                  }}
                >
                  {getHeadStartWinner(headStart)}
                </span>
              )}
            </div>
            <div>
              <FontAwesomeIcon className="text-danger mr-2" icon={faFrown} />
              {getPlayers(losers)}
              {getHeadStartLoser(headStart) && (
                <span
                  className="badge x-small badge-success ml-1"
                  style={{
                    top: "-0.3rem",
                    marginLeft: -2,
                    position: "relative"
                  }}
                >
                  {getHeadStartLoser(headStart).replace("-", "")}
                </span>
              )}
            </div>
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
        <div className="pl-0 pr-2 align-self-center">
          <span className="h6 text-nowrap">
            {gameWonByLostTeam === "6" || gameWonByLostTeam === "5" ? "7" : "6"}{" "}
            - {gameWonByLostTeam}
          </span>
        </div>
      </div>
      {showHead2Head ? (
        <div className="pl-0 align-self-center">
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
      ) : null}
    </div>
  );
};

export default ResultCard;
