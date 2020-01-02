import React, { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import GroupScoreCard from "./GroupScoreCard";
import InfiniteScroll from "react-infinite-scroller";
import HeaderCard from "./Header";
import ResultCard from "./ResultCard";
import RouteNav from "./RouteNav";
import { TournamentDropDown } from "./TournamentDropdown";
import { format } from "date-fns";
import MySpinner from "./MySpinner";

const ViewResults = ({
  scores,
  players,
  group,
  match,
  pendingRequests,
  user,
  tournament,
  history,
  loading,
  hasMore,
  lastDoc,
  ...props
}) => {
  useEffect(() => {
    props.loadGroups();
    props.loadLeaderboard(match.params.group);
    props.loadResult(match.params.group, match.params.tour, null);
  }, []);
  const loadFunc = e => {
    props.loadResult(match.params.group, match.params.tour, lastDoc);
  };
  return (
    <>
      <RouteNav history={history} center="Match Results"></RouteNav>
      {!loading ? (
        <>
          {tournament ? (
            <HeaderCard>
              <span>
                {tournament.description || "Current tournament"}:{" started "}
                {format(tournament.startDate.toDate(), "dd/MM/yy")}
              </span>
            </HeaderCard>
          ) : null}
          {scores && Object.keys(scores).length > 0 ? (
            <div className="pb-3 pl-3 pr-3">
              <InfiniteScroll
                pageStart={0}
                loadMore={loadFunc}
                threshold={70}
                hasMore={hasMore}
                loader={
                  <MySpinner key={0} fontSize="0.7rem" width={25} height={25} />
                }
              >
                {Object.keys(scores).map(k => (
                  <ResultCard
                    key={k}
                    players={players}
                    {...scores[k]}
                  ></ResultCard>
                ))}
              </InfiniteScroll>
            </div>
          ) : (
            <p className="text-center">No match found</p>
          )}
        </>
      ) : (
        <>
          <HeaderCard>
            <Skeleton />
          </HeaderCard>
          <div className="pb-3 pl-3 pr-3">
            <Skeleton height={50} count={10} />
          </div>
        </>
      )}
    </>
  );
};

export default ViewResults;