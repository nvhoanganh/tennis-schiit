import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ListGroup from "react-bootstrap/ListGroup";
import { LinkContainer } from "react-router-bootstrap";
import Card from "react-bootstrap/Card";
import {
  faChartLine,
  faUserCircle,
  faSortAmountUp,
  faSortAmountDown,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import { Player, Mocked_Players } from "@tennis-score/api-interfaces";

interface ILeaderboardProps {
  groupName: string;
  players: Player[];
}
// tslint:disable-next-line: typedef
const scoreStyle = { fontSize: "0.8rem" };

const Leaderboard: React.SFC<ILeaderboardProps> = ({ groupName, players }) => {
  return (
    <>
      <h4 className="text-center pt-3">
        <FontAwesomeIcon icon={faChartLine} /> {groupName} - Leaderboard
      </h4>
      <div className="text-center py-3">
        <LinkContainer to={`/newscore/${groupName}`}>
          <button type="button" className="btn btn-primary btn-sm">
            <FontAwesomeIcon icon={faPlus} /> Submit New Score
          </button>
        </LinkContainer>
      </div>

      <div className="px-1">
        {players.map((p, i) => (
          <Card className="mt-1" body key={p.id}>
            <div className="row">
              <div className="mx-2">
                <FontAwesomeIcon
                  style={{ fontSize: "2rem" }}
                  icon={faUserCircle}
                />
                <div>
                  <span
                    className="badge badge-pill "
                    style={{
                      backgroundColor:
                        i === 0
                          ? "gold"
                          : i === 1
                          ? "silver"
                          : i === 2
                          ? "chocolate"
                          : ""
                    }}
                  >
                    {i === 0 ? "1st" : i === 1 ? "2nd" : i === 2 ? "3rd" : ""}
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
                    {p.displayName}
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
                    (p.winPercentage > 0 ? "text-success" : "text-danger")
                  }
                >
                  {p.winPercentage}%
                  {p.lastWeekWinPercentage > p.winPercentage ? (
                    <FontAwesomeIcon
                      icon={faSortAmountDown}
                      className="pl-1 text-danger"
                    />
                  ) : p.lastWeekWinPercentage < p.winPercentage ? (
                    <FontAwesomeIcon
                      icon={faSortAmountUp}
                      className="pl-1 text-success"
                    />
                  ) : null}
                </div>
                <div
                  className={
                    "h6 " + (p.prizeMoney > 0 ? "text-success" : "text-danger")
                  }
                >
                  ${p.prizeMoney}
                  {p.lastWeekPrizeMoney > p.prizeMoney ? (
                    <FontAwesomeIcon
                      icon={faSortAmountDown}
                      className="pl-1 text-danger"
                    />
                  ) : p.lastWeekPrizeMoney < p.prizeMoney ? (
                    <FontAwesomeIcon
                      icon={faSortAmountUp}
                      className="pl-1 text-success"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

Leaderboard.defaultProps = {
  groupName: "ABC",
  players: Mocked_Players
};

export default Leaderboard;
