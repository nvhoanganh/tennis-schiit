import { Tab, TabList, TabPanel, TabPanels, Tabs, useToast } from "@chakra-ui/core";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getStats, isMember, isOwner } from "@tennis-score/redux";
import { formatDistanceToNow } from "date-fns";
import format from "date-fns/format";
import queryString from "query-string";
import * as R from "ramda";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { LinkContainer } from "react-router-bootstrap";
import setQuery from "set-query-string";
import { Button } from "./Button";
import Confirm from "./Confirm";
import { GroupMemberDropdown } from "./GroupMemberDropdown";
import HeaderCard from "./Header";
import LeaderboardCard from "./LeaderboardCard";
import UpdateButton from "./LoadingButton";
import PendingMemberCard from "./PendingMemberCard";
import RouteNav from "./RouteNav";
import { TournamentDropDown } from "./TournamentDropdown";
import { TournamentStatsChart } from "./TournamentStatsChart";

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
  hasMore,
  lastDoc,
  ...props
}) => {
  // states
  const q = queryString.parse(location.search);
  const toast = useToast();

  const [tabIndex, setTabIndex] = useState(+q.tab || 0);
  const [stats, setStats] = useState(null);
  const [show, setShow] = useState(false);
  const [approvingPlayer, setapprovingPlayer] = useState(null);
  useEffect(() => {
    props.loadLeaderboard(match.params.group);
  }, []);

  useEffect(() => {
    if (tabIndex === 1 && !stats && group && group.currentTournament) {
      getStats(match.params.group, group.currentTournament).then(setStats);
    }
    setQuery({ tab: tabIndex });
  }, [tabIndex, group, stats]);

  const joinHandler = _ => {
    if (!user) {
      history.push("/signup");
    } else {
      props.joinGroup(group.groupId).then(
        toast({
          title: "Join Request Sent",
          status: "success",
          duration: 3000,
          isClosable: true
        })
      );
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
      props.approveJoinRequest(player, match.params.group, null).then(
        toast({
          title: "Player added",
          status: "success",
          duration: 3000,
          isClosable: true
        })
      );
    } else {
      setapprovingPlayer(player);
      handleShow();
    }
  };

  const approveJoinAndMergePlayer = asPlayer => {
    props
      .approveJoinRequest(approvingPlayer, match.params.group, asPlayer)
      .then(_ => {
        handleClose();
        toast({
          title: "Player added",
          status: "success",
          duration: 3000,
          isClosable: true
        });
      });
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* top nav */}
      {group && (
        <>
          <RouteNav
            history={history}
            center={group.name.toUpperCase()}
            right={
              <GroupMemberDropdown
                history={history}
                leaveGroup={props.leaveGroup}
                joinGroup={props.joinGroup}
                user={user}
                group={group}
              />
            }
          ></RouteNav>
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
                      {formatDistanceToNow(isPendingJoin.requestDate.toDate())}
                    </em>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}

      {/* show pending members */}
      {showApprove() ? (
        <div className="mt-3">
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
        </div>
      ) : null}

      {/* tabs */}
      <Tabs
        isFitted
        className="py-2"
        defaultIndex={tabIndex}
        onChange={index => setTabIndex(index)}
      >
        <TabList>
          <Tab>Leaderboard</Tab>
          <Tab>Stats</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {/* leaerboard */}
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
            {loading ? (
              <div className="pb-3">
                {R.range(0, 6).map((k, i) => (
                  <LeaderboardCard
                    key={k}
                    player={null}
                    history={null}
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
                    history={history}
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
                    <LinkContainer
                      to={`/groups/${match.params.group}/newtournament`}
                    >
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
          </TabPanel>
          <TabPanel>
            {group && group.currentTournament ? (
              <>
                {stats ? (
                  <>
                    <div className="py-4 border-bottom shadow-sm">
                      <TournamentStatsChart
                        title="Prize Money"
                        value="prizeMoney"
                        prefix="$"
                        suffix=""
                        players={group.players}
                        stats={stats}
                      ></TournamentStatsChart>
                    </div>

                    <div className="py-4 border-bottom shadow-sm">
                      <TournamentStatsChart
                        title="Win Percentage"
                        value="winPercentage"
                        prefix="%"
                        suffix=""
                        players={group.players}
                        stats={stats}
                      ></TournamentStatsChart>
                    </div>

                    <div className="py-4 border-bottom shadow-sm">
                      <TournamentStatsChart
                        title="TrueSkill Points"
                        value="score"
                        prefix=""
                        suffix="pt."
                        players={group.players}
                        stats={stats}
                      ></TournamentStatsChart>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="py-4 border-bottom shadow-sm">
                      <Skeleton height={400} />
                    </div>

                    <div className="py-4 border-bottom shadow-sm">
                      <Skeleton height={400} />
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-center h6 my-5">No tournament created for this group</div>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Confirm
        title="Add Player"
        size="md"
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
            <div className="py-1">
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
                  <em>Create new</em>
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
