import { format } from "date-fns";
import { LinkContainer } from "react-router-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import React, { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroller";
import Skeleton from "react-loading-skeleton";
import HeaderCard from "./Header";
import MySpinner from "./MySpinner";
import ResultCard from "./ResultCard";
import RouteNav from "./RouteNav";
import { DropDownMenu } from "./DropDownMenu";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";

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
    props.loadLeaderboard(match.params.group);
    props.loadResult(match.params.group, match.params.tour, null);
  }, []);
  const loadFunc = e => {
    props.loadResult(match.params.group, match.params.tour, lastDoc);
  };
  const viewH2hHandler = () => {
    console.log("view h2d");
  };
  return (
    <>
      <RouteNav history={history} center="Match Results"></RouteNav>
      {!loading ? (
        <>
          {tournament ? (
            <HeaderCard
              right={
                <DropDownMenu
                  icon={faEllipsisH}
                  options={[
                    <LinkContainer
                      key="filter"
                      to={`/headtohead/${group.groupId}/tournament/${match.params.tour}`}
                    >
                      <Dropdown.Item>Check Head 2 Head</Dropdown.Item>
                    </LinkContainer>
                  ]}
                />
              }
            >
              <span>
                {tournament.description || "Current tournament"}:{" started "}
                {format(tournament.startDate.toDate(), "dd/MM/yy")}
              </span>
            </HeaderCard>
          ) : null}
          {scores && Object.keys(scores).length > 0 ? (
            <div className="pb-3 pl-1 pr-1">
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
                    groupId={match.params.group}
                    showHead2Head={true}
                    tournamentId={match.params.tour}
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
            <Skeleton height={90} count={10} />
          </div>
        </>
      )}
    </>
  );
};

export default ViewResults;
