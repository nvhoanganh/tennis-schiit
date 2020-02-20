import { Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, useDisclosure } from "@chakra-ui/core";
import { DeleteScore, getPossibleVerse, isMember, SearchScore } from "@tennis-score/redux";
import format from "date-fns/format";
import React, { useEffect, useState } from "react";
import { FaEllipsisH } from "react-icons/fa";
import InfiniteScroll from "react-infinite-scroller";
import Skeleton from "react-loading-skeleton";
import { Button } from "./Button";
import Confirm from "./Confirm";
import { DrawerLink, DropDownMenu } from "./DropDownMenu";
import { Head2HeadChart } from "./Head2HeadChart";
import HeaderCard from "./Header";
import MySpinner from "./MySpinner";
import ResultCard from "./ResultCard2";
import RouteNav from "./RouteNav";
import { ScrollPills } from "./ScrollPills";
import { ShareLink } from "./ShareLink";

const ViewResults = ({
  scores,
  scoresSorted,
  players,
  group,
  user,
  match,
  tournament,
  history,
  loading,
  hasMore,
  lastDoc,
  ...props
}) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(() => {
    props.loadLeaderboard(match.params.group);
    props.loadResult(match.params.group, match.params.tour, null);
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const loadFunc = e => {
    props.loadResult(match.params.group, match.params.tour, lastDoc);
  };
  const [h2h, seth2h] = useState<any>({});
  const [deletingScore, setDeletingScore] = useState<any>(null);
  const [activeLbl, setactiveLbl] = useState<string>("All");

  const deleteScore = () => {
    DeleteScore({
      ...deletingScore,
      groupId: match.params.group,
      tourId: match.params.tour
    }).then(() => {
      handleClose();
      props.loadLeaderboard(match.params.group);
      props.loadResult(match.params.group, match.params.tour, null);
    });
  };

  const viewHead2Head = ({ winners, losers, showAll, label }) => {
    onOpen();
    setactiveLbl(label);
    SearchScore({
      groupId: match.params.group,
      tourId: match.params.tour,
      ...{ winners, losers }
    }).then(result => {
      seth2h(state => ({
        ...state,
        ...{ winners, losers },
        scores: result,
        ...(showAll && {
          originalWinners: winners,
          originalLosers: losers
        })
      }));
    });
  };

  return (
    <>
      <RouteNav history={history} center="Match Results"></RouteNav>
      {scores && Object.keys(scores).length > 0 ? (
        <>
          {tournament ? (
            <HeaderCard
              right={
                <DropDownMenu
                  icon={<FaEllipsisH />}
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
                    </DrawerLink>,
                    <ShareLink
                      title={`${group.name} Results`}
                      text={`Check out ${group.name} match results!`}
                      url={window.location.href}
                    />
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
              {scoresSorted.map(k => (
                <div key={k.matchDate}>
                  <HeaderCard>
                    <strong>{format(k.matchDate, "E, dd/MM/yyyy")}</strong>
                  </HeaderCard>
                  {k.matches.map((m, i) => (
                    <ResultCard
                      key={i}
                      players={players}
                      groupId={match.params.group}
                      tournamentId={match.params.tour}
                      showHead2Head={viewHead2Head}
                      canDelete={
                        i === k.matches.length - 1 && isMember(user, group)
                      }
                      deleteScore={() => {
                        setDeletingScore(m);
                        handleShow();
                      }}
                      {...m}
                    ></ResultCard>
                  ))}
                </div>
              ))}
            </InfiniteScroll>
          </div>
        </>
      ) : (
        <>
          {loading ? (
            <>
              <HeaderCard>
                <Skeleton />
              </HeaderCard>
              <div className="pb-3 pl-3 pr-3">
                <Skeleton height={60} count={10} />
              </div>
            </>
          ) : (
            <p className="text-center">No match found</p>
          )}
        </>
      )}

      <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Head 2 Head Result</DrawerHeader>
          <div>
            <ScrollPills height={44}>
              <span
                className={
                  "md badge ml-1 badge-pill font-weight-normal border " +
                  (!activeLbl ? "badge-primary" : "badge-light")
                }
                onClick={() =>
                  viewHead2Head({
                    winners: h2h.originalWinners,
                    losers: h2h.originalLosers,
                    showAll: true,
                    label: null
                  })
                }
              >
                All
              </span>
              {h2h.scores &&
                getPossibleVerse(
                  players,
                  h2h.originalWinners,
                  h2h.originalLosers
                ).map(x => (
                  <span
                    key={x.label}
                    className={
                      "md badge ml-1 badge-pill  font-weight-normal border " +
                      (activeLbl === x.label ? "badge-primary" : "badge-light")
                    }
                    onClick={() =>
                      viewHead2Head({
                        winners: x.player1,
                        losers: x.player2,
                        showAll: false,
                        label: x.label
                      })
                    }
                  >
                    {x.label}
                  </span>
                ))}
            </ScrollPills>
          </div>
          <DrawerBody className="py-4 pb-5">
            {h2h.scores ? (
              <>
                <Head2HeadChart
                  scores={h2h.scores}
                  winners={h2h.winners}
                  losers={h2h.losers}
                  players={players}
                />
                <Button
                  onClick={() =>
                    history.push(
                      `/headtohead/${match.params.group}/tournament/${
                        match.params.tour
                      }/?team1=${Object.keys(h2h.winners).join(
                        "|"
                      )}&team2=${Object.keys(h2h.losers).join("|")}`
                    )
                  }
                  value="Sign Out"
                  type="button"
                  className="mt-3 btn btn-primary btn-sm btn-block"
                >
                  Show Detailed Results
                </Button>
              </>
            ) : (
              <Skeleton height={350} />
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Confirm
        title="Delete Result?"
        message="Are you sure you want to delete this match result?"
        close="Cancel"
        mainAction="Delete"
        mainActionClass="red"
        onCancelAction={handleClose}
        onConfirmAction={deleteScore}
        show={show}
      ></Confirm>
    </>
  );
};

export default ViewResults;
