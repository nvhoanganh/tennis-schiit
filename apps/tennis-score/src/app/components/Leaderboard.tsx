import { faChartLine, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import FloatButton from "./FloatButton";
import LeaderboardCard from "./LeaderboardCard";
import MySpinner from "./MySpinner";
import GroupScoreCard from "./GroupScoreCard";
import { GroupMembership } from "./GroupMembership";
import format from "date-fns/format";

const Leaderboard = ({
  players,
  group,
  match,
  pendingRequests,
  user,
  tournament,
  ...props
}) => {
  useEffect(() => {
    props.loadGroups();
    props.loadLeaderboard(match.params.group);
  }, []);
  return (
    <>
      {group && user ? (
        <div className="text-center pb-4">
          <div className="pt-2 h1">{group.name.toUpperCase()}</div>
          <GroupMembership user={user} group={group} />
          <GroupScoreCard group={group} user={user}></GroupScoreCard>

          {tournament && (
            <em className="text-muted" style={{ fontSize: "0.7rem" }}>
              Current tournament:{" "}
              {format(tournament.startDate.toDate(), "dd/MM/yy")} -{" "}
              {format(tournament.endDate.toDate(), "dd/MM/yy")}
            </em>
          )}
        </div>
      ) : null}
      <FloatButton
        icon={faPlus}
        tooltip="Add new score"
        url={`/newscore/${match.params.group}`}
      ></FloatButton>
      {pendingRequests === 0 && players ? (
        <div className="px-1 pb-5">
          {players.map((k, i) => (
            <LeaderboardCard
              key={k.id}
              player={k}
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
