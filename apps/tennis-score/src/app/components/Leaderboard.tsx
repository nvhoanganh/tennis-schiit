import { faChartLine, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import LeaderboardCard from "./LeaderboardCard";
import MySpinner from "./MySpinner";
import FloatButton from "./FloatButton";

const Leaderboard = ({
  groupName,
  players,
  match,
  pendingRequests,
  ...props
}) => {
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
      <FloatButton
        icon={faPlus}
        tooltip="Add new score"
        url={`/newscore/${match.params.group || groupName}`}
      />

      {pendingRequests === 0 ? (
        <div className="px-1 pb-5">
          {players.map((p, i) => (
            <LeaderboardCard
              key={p.id}
              player={p}
              ranking={i}
            ></LeaderboardCard>
          ))}
        </div>
      ) : (
        <MySpinner />
      )}
    </>
  );
};

export default Leaderboard;
