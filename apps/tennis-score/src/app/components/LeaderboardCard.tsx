import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card from "react-bootstrap/Card";
import {
  faUserCircle,
  faSortAmountUp,
  faSortAmountDown} from "@fortawesome/free-solid-svg-icons";
import { Player } from "@tennis-score/api-interfaces";
const scoreStyle = { fontSize: "0.8rem" };

const LeaderboardCard: React.SFC<{
  player: Player;
  ranking: number;
}> = ({ player, ranking }) => {
  return (
    <Card className="mt-1" body key={player.id}>
      <div className="row">
        <div className="mx-2">
          <FontAwesomeIcon style={{ fontSize: "2rem" }} icon={faUserCircle} />
          <div>
            <span
              className="badge badge-pill "
              style={{
                backgroundColor:
                  ranking === 0
                    ? "gold"
                    : ranking === 1
                    ? "silver"
                    : ranking === 2
                    ? "chocolate"
                    : ""
              }}
            >
              {ranking === 0
                ? "1st"
                : ranking === 1
                ? "2nd"
                : ranking === 2
                ? "3rd"
                : ""}
            </span>
          </div>
        </div>
        <div className="mr-auto">
          <div>
            <button
              type="button"
              style={{ paddingLeft: 8 }}
              className="btn btn-link"
            >
              {player.displayName}
            </button>
          </div>
          <div>
            <button
              style={scoreStyle}
              type="button"
              className="btn btn-sm btn-default"
            >
              P<span className="ml-1 badge badge-light">4</span>
            </button>
            <button
              style={scoreStyle}
              type="button"
              className="btn btn-sm btn-default"
            >
              W<span className="ml-1 badge badge-success">4</span>
            </button>
            <button
              style={scoreStyle}
              type="button"
              className="btn btn-sm btn-default"
            >
              L<span className="ml-1 badge badge-danger">4</span>
            </button>
            <button
              style={scoreStyle}
              type="button"
              className="btn btn-sm btn-default"
            >
              BW<span className="ml-1 badge badge-warning">4</span>
            </button>
            <button
              style={scoreStyle}
              type="button"
              className="btn btn-sm btn-default"
            >
              BL<span className="ml-1 badge badge-danger">4</span>
            </button>
          </div>
        </div>
        <div className="float-right">
          <div
            className={
              "h6 " +
              (player.winPercentage > 0 ? "text-success" : "text-danger")
            }
          >
            {player.winPercentage}%
            {player.lastWeekWinPercentage > player.winPercentage ? (
              <FontAwesomeIcon
                icon={faSortAmountDown}
                className="pl-1 text-danger"
              />
            ) : player.lastWeekWinPercentage < player.winPercentage ? (
              <FontAwesomeIcon
                icon={faSortAmountUp}
                className="pl-1 text-success"
              />
            ) : null}
          </div>
          <div
            className={
              "h6 " + (player.prizeMoney > 0 ? "text-success" : "text-danger")
            }
          >
            ${player.prizeMoney}
            {player.lastWeekPrizeMoney > player.prizeMoney ? (
              <FontAwesomeIcon
                icon={faSortAmountDown}
                className="pl-1 text-danger"
              />
            ) : player.lastWeekPrizeMoney < player.prizeMoney ? (
              <FontAwesomeIcon
                icon={faSortAmountUp}
                className="pl-1 text-success"
              />
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LeaderboardCard;
