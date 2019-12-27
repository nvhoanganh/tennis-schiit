import {
  faBars,
  faClipboardList,
  faUserPlus,
  faEllipsisH
} from "@fortawesome/free-solid-svg-icons";
import { isMember, isOwner } from "@tennis-score/redux";
import format from "date-fns/format";
import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";

import { Button } from "./Button";
import FloatActionsButton from "./FloatActionsButton";
import { GroupMemberDropdown } from "./GroupMemberDropdown";
import GroupScoreCard from "./GroupScoreCard";
import LeaderboardCard from "./LeaderboardCard";
import UpdateButton from "./LoadingButton";
import MySpinner from "./MySpinner";
import RouteNav from "./RouteNav";
import HeaderCard from "./Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TournamentDropDown } from "./TournamentDropdown";

const ShowAddTour = ({ groupId, isOwner }) => {
  return isOwner ? (
    <div className="text-center font-italic py-5">
      No tournament created yet
      <div className="row pt-3">
        <div className="col-12 px-3">
          <div className="form-group">
            <LinkContainer to={`/groups/${groupId}/newtournament`}>
              <Button className="btn btn-primary btn-sm">Add Tournament</Button>
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
  loading,
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
            right={
              <GroupMemberDropdown
                leaveGroup={props.leaveGroup}
                joinGroup={props.joinGroup}
                user={user}
                group={group}
              />
            }
          ></RouteNav>

          <div className="px-3">
            <GroupScoreCard
              group={group}
              user={user}
              players={players}
            ></GroupScoreCard>
          </div>

          {!isMember(user, group) && (
            <div className="text-center p-3">
              <UpdateButton
                loading={loading}
                value="Join Group"
                type="submit"
                className="btn btn-primary btn-sm btn-block btn-sm"
              ></UpdateButton>
            </div>
          )}
        </>
      )}

      {user && urls.length > 0 && (
        <FloatActionsButton
          icon={faBars}
          urls={getPermittedActions()}
        ></FloatActionsButton>
      )}
      {tournament ? (
        <HeaderCard right={<TournamentDropDown user={user} group={group} />}>
          Current tournament:{" "}
          {format(tournament.startDate.toDate(), "dd/MM/yy")} -{" "}
          {tournament.endDate
            ? format(tournament.endDate.toDate(), "dd/MM/yy")
            : ""}
        </HeaderCard>
      ) : (
        <HeaderCard right={<TournamentDropDown user={user} group={group} />}>
          Members
        </HeaderCard>
      )}
      {/*  show leaderboard */}
      {!loading ? (
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
          <div>Add new user first</div>
        )
      ) : (
        <MySpinner />
      )}
    </>
  );
};

export default Leaderboard;
