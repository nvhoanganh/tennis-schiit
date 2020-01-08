import { isMember, isOwner } from "@tennis-score/redux";
import format from "date-fns/format";
import React, { useEffect, useState } from "react";
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
import Confirm from "./Confirm";
import * as R from "ramda";
import { Button } from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

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
    if (players.filter(x => !x.linkedplayerId).length === 0) {
      // approve as new
      props.approveJoinRequest(player, match.params.group, null);
    } else {
      setapprovingPlayer(player);
      handleShow();
    }
  };

  const approveJoinAndMergePlayer = asPlayer => {
    props
      .approveJoinRequest(approvingPlayer, match.params.group, asPlayer)
      .then(_ => handleClose());
  };
  const [show, setShow] = useState(false);
  const [approvingPlayer, setapprovingPlayer] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
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
              <Skeleton height={48} />
            )}
          </div>

          {!isMember(user, group) && !loading && (
            <div className="text-center p-2">
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
            {tournament.description || "Current tournament"}:{" started "}
            {format(tournament.startDate.toDate(), "dd/MM/yy")}
          </span>
        ) : (
          "Members"
        )}
      </HeaderCard>
      {/*  show leaderboard */}
      {loading ? (
        <div className="pb-3">
          {R.range(0, 6).map((k, i) => (
            <LeaderboardCard
              key={k}
              player={null}
              ranking={null}
              loading={true}
            ></LeaderboardCard>
          ))}
        </div>
      ) : players.length > 0 ? (
        <div className="pb-3">
          {players.map((k, i) => (
            <LeaderboardCard
              key={k.id}
              player={k}
              group={group}
              sortBy={tournament ? tournament.sortBy : ""}
              ranking={i}
            ></LeaderboardCard>
          ))}
          <div className="text-center p-2">
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

      <Confirm
        title="Add Player"
        close="Cancel"
        onCancelAction={handleClose}
        message={
          <>
            <div>
              <span className="h5">
                {approvingPlayer ? approvingPlayer.displayName : ""}
              </span>{" "}
              is the same player as:
            </div>
            <div className="py-1 px-2">
              {players
                .filter(x => !x.linkedplayerId)
                .map(p => (
                  <HeaderCard
                    key={p.id}
                    right={
                      <Button
                        type="button"
                        onClick={() => approveJoinAndMergePlayer(p)}
                        className="btn btn-primary btn-sm"
                      >
                        <FontAwesomeIcon icon={faCheckCircle} /> Select
                      </Button>
                    }
                  >
                    <span>{p.name}</span>
                  </HeaderCard>
                ))}
              <HeaderCard
                key={0}
                right={
                  <Button
                    type="button"
                    onClick={() => approveJoinAndMergePlayer(null)}
                    className="btn btn-primary btn-sm"
                  >
                    <FontAwesomeIcon icon={faCheckCircle} /> Select
                  </Button>
                }
              >
                <span>
                  <em>None above, create new</em>
                </span>
              </HeaderCard>
            </div>
          </>
        }
        show={show}
      ></Confirm>
    </>
  );
};

export default Leaderboard;
