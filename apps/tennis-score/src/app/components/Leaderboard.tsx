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
import { isOwner, isMember } from "@tennis-score/redux";
import { Button } from "./Button";

const ShowAddTour = ({ groupId, isOwner }) => {
  return isOwner ? (
    <div className="text-center font-italic py-5">
      No tournament created yet
      <div className="row pt-3">
        <div className="col-12 px-3">
          <div className="form-group">
            <LinkContainer to={`/groups/${groupId}/newtournament`}>
              <Button className="btn btn-primary">Add Tournament</Button>
            </LinkContainer>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p className="text-center font-italic py-5">No tournament created yet</p>
  );
};

const ShowAddFirstMatch = () => (
  <p className="text-center font-italic py-5">
    Click add buton to add your first match
  </p>
);
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
  const getPermittedActions = () => {
    let urls = [];
    if (isMember(user, group)) {
      if (tournament) {
        urls.push({
          url: `/newscore/${match.params.group}`,
          tooltip: "New Score",
          icon: faClipboardList
        });
      } else {
        urls.push({
          url: `/groups/${match.params.group}/newtournament`,
          tooltip: "New Score",
          icon: faClipboardList
        });
      }
    }

    if (isOwner(user, group)) {
      urls.push({
        url: `/groups/${match.params.group}/newplayer`,
        tooltip: "New Player",
        icon: faUserPlus
      });
    }
    return urls;
  };

  const urls = getPermittedActions();
  const showFallBack = () => {
    if (!tournament) {
      return (
        <ShowAddTour
          groupId={match.params.group}
          isOwner={isOwner(user, group)}
        ></ShowAddTour>
      );
    }
    return <ShowAddFirstMatch />;
  };
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

          <div className="text-center pb-4" >
            {tournament && (
              <>
                <GroupScoreCard
                  group={group}
                  user={user}
                  players={players}
                ></GroupScoreCard>
                <em className="text-muted x-small">
                  Current tournament:{" "}
                  {format(tournament.startDate.toDate(), "dd/MM/yy")} -{" "}
                  {tournament.endDate
                    ? format(tournament.endDate.toDate(), "dd/MM/yy")
                    : ""}
                </em>
              </>
            )}
          </div>
        </>
      )}

      {/*  show float button */}
      {user && urls.length > 0 && (
        <FloatActionsButton
          icon={faBars}
          urls={getPermittedActions()}
        ></FloatActionsButton>
      )}

      {/*  show leaderboard */}
      {pendingRequests === 0 ? (
        players.length > 0 ? (
          <div className="px-1" style={{ marginBottom: 100 }}>
            {players.map((k, i) => (
              <LeaderboardCard
                key={k.id}
                player={k}
                ranking={i}
              ></LeaderboardCard>
            ))}
          </div>
        ) : (
          showFallBack()
        )
      ) : (
        <MySpinner />
      )}
    </>
  );
};

export default Leaderboard;
