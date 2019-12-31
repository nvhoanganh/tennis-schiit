import React, { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import GroupScoreCard from "./GroupScoreCard";
import HeaderCard from "./Header";
import ResultCard from "./ResultCard";
import RouteNav from "./RouteNav";
import { TournamentDropDown } from "./TournamentDropdown";

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
  ...props
}) => {
  useEffect(() => {
    props.loadGroups();
    props.loadLeaderboard(match.params.group);
    props.loadResult(match.params.group, match.params.tour);
  }, []);
  return (
    <>
      <RouteNav history={history} center="Match Results"></RouteNav>
      {!loading ? (
        <>
          <HeaderCard>Latest Scores</HeaderCard>
          {scores && Object.keys(scores).length > 0 ? (
            <div className="pb-3 pl-3 pr-3">
              {Object.keys(scores).map(k => (
                <ResultCard
                  key={k}
                  players={players}
                  {...scores[k]}
                ></ResultCard>
              ))}
            </div>
          ) : null}
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
