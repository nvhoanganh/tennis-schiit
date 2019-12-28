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
import Skeleton from 'react-loading-skeleton';

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
  const canSubmitNewScore = () =>
    user && isMember(user, group) && tournament && !loading;
  const canCreateTour = () =>
    user && isOwner(user, group) && !tournament && !loading;

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
        <div className="px-1">
          {[1, 2, 3, 4, 5].map(k => (
            <LeaderboardCard
              key={k}
              player={null}
              ranking={null}
              loading={true}
            ></LeaderboardCard>
          ))}
        </div>
      ) : players.length > 0 ? (
        <div className="px-1">
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
    </>
  );
};

export default Leaderboard;
