import { isMember, isOwner } from "@tennis-score/redux";
import format from "date-fns/format";
import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { GroupMemberDropdown } from "./GroupMemberDropdown";
import GroupScoreCard from "./GroupScoreCard";
import HeaderCard from "./Header";
import LeaderboardCard from "./LeaderboardCard";
import UpdateButton from "./LoadingButton";
import RouteNav from "./RouteNav";
import { TournamentDropDown } from "./TournamentDropdown";
import Skeleton from "react-loading-skeleton";
import { formatDistanceToNow } from "date-fns";
import PendingMemberCard from "./PendingMemberCard";

const Leaderboard = ({
  pendingJoinRequests,
  players,
  group,
  match,
  pendingRequests,
  user,
  isPendingJoin,
  tournament,
  history,
  loading,
  ...props
}) => {
  const joinHandler = _ => {
    if (!user) {
      history.push("/signup");
    } else {
      props.joinGroup(group.groupId);
    }
  };
  const canSubmitNewScore = () =>
    user && isMember(user, group) && tournament && !loading;
  const canCreateTour = () =>
    user && isOwner(user, group) && !tournament && !loading;
  const showApprove = () =>
    !loading &&
    isMember(user, group) &&
    pendingJoinRequests &&
    pendingJoinRequests.length > 0;

  const rejectJoinRequestHandler = player => {
    props.rejectJoinRequest(player, match.params.group);
  };
  const approveJoinRequestHandler = player => {
    props.approveJoinRequest(player, match.params.group);
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
            right={
              <GroupMemberDropdown
                history
                leaveGroup={props.leaveGroup}
                joinGroup={props.joinGroup}
                user={user}
                group={group}
              />
            }
          ></RouteNav>
          <div className="px-3">
            {!loading ? (
              <GroupScoreCard
                group={group}
                user={user}
                players={players}
              ></GroupScoreCard>
            ) : (
              <Skeleton height={90} />
            )}
          </div>

          {!isMember(user, group) && !loading && (
            <div className="text-center p-3">
              {!isPendingJoin ? (
                <UpdateButton
                  loading={pendingRequests}
                  disabled={pendingRequests}
                  value="Join Group"
                  onClick={joinHandler}
                  type="button"
                  className="btn btn-primary btn-sm btn-block btn-sm"
                ></UpdateButton>
              ) : (
                <>
                  <UpdateButton
                    loading={pendingRequests}
                    disabled={pendingRequests}
                    value="Cancel Join Request"
                    onClick={() => props.cancelJoinGroup(group.groupId)}
                    type="button"
                    className="btn btn-outline-dark btn-sm btn-block btn-sm"
                  ></UpdateButton>
                  <div className="text-center">
                    <em className="text-muted x-small">
                      Request sent{" "}
                      {formatDistanceToNow(isPendingJoin.requestDate.toDate(), {
                        addSuffix: true
                      })}
                    </em>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}

      <HeaderCard
        right={
          <TournamentDropDown
            user={user}
            group={group}
            tournament={tournament}
          />
        }
      >
        {tournament ? (
          <span>
            Current tournament:{" "}
            {format(tournament.startDate.toDate(), "dd/MM/yy")} -{" "}
            {tournament.endDate
              ? format(tournament.endDate.toDate(), "dd/MM/yy")
              : ""}
          </span>
        ) : (
          "Members"
        )}
      </HeaderCard>
      {/*  show leaderboard */}
      {loading ? (
        <div className="pb-3">
          <LeaderboardCard
            player={null}
            ranking={null}
            loading={true}
          ></LeaderboardCard>
        </div>
      ) : players.length > 0 ? (
        <div className="pb-3">
          {players.map((k, i) => (
            <LeaderboardCard
              key={k.id}
              player={k}
              ranking={i}
            ></LeaderboardCard>
          ))}
          <div className="text-center p-3">
            {canSubmitNewScore() && (
              <LinkContainer to={`/newscore/${match.params.group}`}>
                <UpdateButton
                  loading={loading}
                  value="Submit Result"
                  type="submit"
                  className="btn btn-primary btn-sm btn-block btn-sm"
                ></UpdateButton>
              </LinkContainer>
            )}

            {canCreateTour() && (
              <LinkContainer to={`/groups/${match.params.group}/newtournament`}>
                <UpdateButton
                  loading={loading}
                  value="Create Tournament"
                  type="submit"
                  className="btn btn-primary btn-sm btn-block btn-sm"
                ></UpdateButton>
              </LinkContainer>
            )}
          </div>
        </div>
      ) : null}
      {showApprove() ? (
        <>
          <HeaderCard>Approve pending members</HeaderCard>
          <div className="pb-4">
            {pendingJoinRequests.map((k, i) => (
              <PendingMemberCard
                key={k.uid}
                rejectJoinRequest={rejectJoinRequestHandler}
                approveJoinRequest={approveJoinRequestHandler}
                player={k}
              ></PendingMemberCard>
            ))}
          </div>
        </>
      ) : null}
    </>
  );
};

export default Leaderboard;
