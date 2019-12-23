import { faPlus } from "@fortawesome/free-solid-svg-icons";
import format from "date-fns/format";
import React, { useEffect } from "react";
import FloatButton from "./FloatButton";
import { GroupMemberDropdown } from "./GroupMemberDropdown";
import { GroupMembership } from "./GroupMembership";
import GroupScoreCard from "./GroupScoreCard";
import LeaderboardCard from "./LeaderboardCard";
import MySpinner from "./MySpinner";
import RouteNav from "./RouteNav";

const Leaderboard = ({
  players,
  group,
  match,
  pendingRequests,
  user,
  tournament,
  history,
  ...props
}) => {
  useEffect(() => {
    props.loadGroups();
    props.loadLeaderboard(match.params.group);
  }, []);
  return (
    <>
      {group && (
        <>
          <RouteNav
            history={history}
            center={<span className="h3">{group.name.toUpperCase()}</span>}
            right={<GroupMemberDropdown user={user} group={group} />}
          ></RouteNav>

          <div className="text-center pb-4">
            <GroupMembership user={user} group={group} showIsMember={true} />
            <GroupScoreCard group={group} user={user}></GroupScoreCard>
            {tournament && (
              <em className="text-muted" style={{ fontSize: "0.7rem" }}>
                Current tournament:{" "}
                {format(tournament.startDate.toDate(), "dd/MM/yy")} -{" "}
                {format(tournament.endDate.toDate(), "dd/MM/yy")}
              </em>
            )}
          </div>
        </>
      )}
      <FloatButton
        icon={faPlus}
        tooltip="Add new score"
        url={`/newscore/${match.params.group}`}
      ></FloatButton>
      {pendingRequests === 0 && players ? (
        players.length > 0 ? (
          <div className="px-1 pb-5">
            {players.map((k, i) => (
              <LeaderboardCard
                key={k.id}
                player={k}
                ranking={i}
              ></LeaderboardCard>
            ))}
          </div>
        ) : <p className="text-center font-italic py-5">Click add buton to add your first match</p>
      ) : (
          <MySpinner />
        )}
    </>
  );
};

export default Leaderboard;
