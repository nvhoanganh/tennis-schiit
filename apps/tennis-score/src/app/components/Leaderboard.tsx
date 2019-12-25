import {
  faPlus,
  faHamburger,
  faClipboardList,
  faUserPlus,
  faBars,
  faTrophy
} from "@fortawesome/free-solid-svg-icons";
import format from "date-fns/format";
import { LinkContainer } from "react-router-bootstrap";
import React, { useEffect } from "react";
import FloatButton from "./FloatButton";
import { GroupMemberDropdown } from "./GroupMemberDropdown";
import { GroupMembership } from "./GroupMembership";
import GroupScoreCard from "./GroupScoreCard";
import LeaderboardCard from "./LeaderboardCard";
import MySpinner from "./MySpinner";
import RouteNav from "./RouteNav";
import FloatActionsButton from "./FloatActionsButton";
import { Link } from "./Link";

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
  let urls = [
    {
      url: `/groups/${match.params.group}/newtournament`,
      tooltip: "New Tournament",
      icon: faTrophy
    },
    {
      url: `/groups/${match.params.group}/newplayer`,
      tooltip: "New Player",
      icon: faUserPlus
    }
  ];

  if (tournament) {
    urls.push({
      url: `/newscore/${match.params.group}`,
      tooltip: "New Score",
      icon: faClipboardList
    });
  }
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
            center={group.name.toUpperCase()}
            right={<GroupMemberDropdown user={user} group={group} />}
          ></RouteNav>

          <div className="text-center pb-4">
            <GroupMembership user={user} group={group} showIsMember={true} />
            <GroupScoreCard
              group={group}
              user={user}
              players={players}
            ></GroupScoreCard>
            {tournament ? (
              <em className="text-muted x-small">
                Current tournament:{" "}
                {format(tournament.startDate.toDate(), "dd/MM/yy")} -{" "}
                {format(tournament.endDate.toDate(), "dd/MM/yy")}
              </em>
            ) : (
              <em className="text-muted x-small">
                No tournament created yet -{" "}
                <LinkContainer
                  to={`/groups/${match.params.group}/newtournament`}
                >
                  <Link title="Add tournament" href="">
                    Add
                  </Link>
                </LinkContainer>
              </em>
            )}
          </div>
        </>
      )}
      <FloatActionsButton icon={faBars} urls={urls}></FloatActionsButton>
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
        ) : (
          <p className="text-center font-italic py-5">
            Click add buton to add your first match
          </p>
        )
      ) : (
        <MySpinner />
      )}
    </>
  );
};

export default Leaderboard;
