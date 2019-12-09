import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LinkContainer } from "react-router-bootstrap";
import { faChartLine, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Player } from "@tennis-score/api-interfaces";
import { IScore } from "@tennis-score/redux";
import LeaderboardCard from "./LeaderboardCard";

const Leaderboard: React.SFC<{
  groupName: string;
  players: Player[];
  match: any;
  loadPlayers(): any;
  loadGroups(): any;
  addScore(score: IScore): any;
}> = ({ groupName, players, ...props }) => {
  useEffect(() => {
    props.loadPlayers();
    props.loadGroups();
  }, []);
  return (
    <>
      <h4 className="text-center pt-3">
        <FontAwesomeIcon icon={faChartLine} /> {match.params.group || groupName}{" "}
        - Leaderboard
      </h4>
      <div className="text-center py-3">
        <LinkContainer to={`/newscore/${groupName}`}>
          <button type="button" className="btn btn-primary btn-sm">
            <FontAwesomeIcon icon={faPlus} /> Submit New Score
          </button>
        </LinkContainer>
      </div>

      <div className="px-1 pb-5">
        {players.map((p, i) => (
          <LeaderboardCard key={p.id} player={p} ranking={i}></LeaderboardCard>
        ))}
      </div>
    </>
  );
};

export default Leaderboard;
