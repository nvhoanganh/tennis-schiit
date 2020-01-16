import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { getHandyCap } from "@tennis-score/redux";
import { formatDistanceToNow } from "date-fns";
import React from "react";
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
    players,
    hideMenu,
    showHead2Head
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
      <div className="pr-1 w-100 flex-grow-1 align-self-center">
        {getPlayers(losers, true)}
      </div>
      {!hideMenu && (
        <div className="p-1 align-self-center">
          <DropDownMenu
            icon={faEllipsisV}
            options={[
              <a
                key="filter"
                onClick={() =>
                  showHead2Head({
                    winners,
                    losers,
                    showAll: true
                  })
                }
                className="h5 py-2 d-block"
              >
                View Head 2 Head
              </a>
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default ResultCard;
