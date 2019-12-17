import { faChartLine, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import FloatButton from "./FloatButton";
import LeaderboardCard from "./LeaderboardCard";
import MySpinner from "./MySpinner";
import GroupScoreCard from "./GroupScoreCard";
import { GroupMembership } from "./GroupMembership";

const Leaderboard = ({
  players,
  group,
  match,
  pendingRequests,
  user,
  ...props
}) => {
  useEffect(() => {
    props.loadPlayers();
    props.loadGroups();
    props.loadLeaderboard(match.params.group);
  }, []);
  return (
    <>
      {group && user ? (
        <div className="text-center pb-3">
          <div className="pt-3 h1">
            <FontAwesomeIcon icon={faChartLine} /> {group.name.toUpperCase()}
          </div>
          <GroupMembership user={user} group={group} />
          <GroupScoreCard group={group} user={user}></GroupScoreCard>
        </div>
      ) : null}
      <FloatButton
        icon={faPlus}
        tooltip="Add new score"
        url={`/newscore/${match.params.group}`}
      ></FloatButton>
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
