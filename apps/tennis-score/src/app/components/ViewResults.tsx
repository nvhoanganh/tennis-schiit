import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  useDisclosure
} from "@chakra-ui/core";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { SearchScore } from "@tennis-score/redux";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import Skeleton from "react-loading-skeleton";
import Confirm from "./Confirm";
import { DrawerLink, DropDownMenu } from "./DropDownMenu";
import { Head2HeadChart } from "./Head2HeadChart";
import HeaderCard from "./Header";
import MySpinner from "./MySpinner";
import ResultCard from "./ResultCard2";
import RouteNav from "./RouteNav";

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const loadFunc = e => {
    props.loadResult(match.params.group, match.params.tour, lastDoc);
  };
  const [h2h, seth2h] = useState<any>({});
  const viewHead2Head = state => {
    onOpen();
    SearchScore({
      groupId: match.params.group,
      tourId: match.params.tour,
      ...state
    }).then(result => {
      seth2h({
        winners: state.winners,
        losers: state.losers,
        scores: result
      });
    });
  };

  const handleShowMore = () =>
    history.push(
      `/headtohead/${match.params.group}/tournament/${
        match.params.tour
      }/?team1=${Object.keys(h2h.winners).join("|")}&team2=${Object.keys(
        h2h.losers
      ).join("|")}`
    );

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
                    <DrawerLink
                      key="menu"
                      onClick={() =>
                        history.push(
                          `/headtohead/${group.groupId}/tournament/${match.params.tour}`
                        )
                      }
                    >
                      Check Head 2 Head
                    </DrawerLink>
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
                    tournamentId={match.params.tour}
                    showHead2Head={viewHead2Head}
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

      <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody className="py-4 pb-5">
            {h2h.scores ? (
              <Head2HeadChart
                scores={h2h.scores}
                winners={h2h.winners}
                losers={h2h.losers}
                players={players}
              />
            ) : (
              <Skeleton height={350} />
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ViewResults;
