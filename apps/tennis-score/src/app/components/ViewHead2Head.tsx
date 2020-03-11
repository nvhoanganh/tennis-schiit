import { getPlayersName, getSortedResult, SearchScore } from "@tennis-score/redux";
import queryString from "query-string";
import React, { useEffect, useRef, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import setQuery from "set-query-string";
import { DropDownMenu } from "./DropDownMenu";
import { Head2HeadChart } from "./Head2HeadChart";
import HeaderCard from "./Header";
import UpdateButton from "./LoadingButton";
import { PlayerPicker } from "./PlayerPicker";
import ResultCard from "./ResultCard2";
import RouteNav from "./RouteNav";
import { ShareLink } from "./ShareLink";

const getPlayers = (p, allP) => <span>{getPlayersAsText(p, allP)}</span>;
const getPlayersAsText = (p, allP) => getPlayersName(p, allP).join("/");

const ViewHead2Head = ({
  pendingRequests,
  group,
  players,
  playersAsObject,
  match,
  location,
  submitScore,
  history,
  ...props
}) => {
  const getInitState = () => {
    const q = queryString.parse(location.search);
    if (q.team1 && q.team2) {
      const toretun = {
        winners: {},
        losers: {},
        formValid: true
      };

      (q.team1 as string).split("|").forEach(x => {
        toretun.winners[x] = true;
        toretun[`w_${x}`] = true;
      });
      (q.team2 as string).split("|").forEach(x => {
        toretun.losers[x] = true;
        toretun[`l_${x}`] = true;
      });
      return toretun;
    }
    return { winners: {}, losers: {}, formValid: false };
  };
  useEffect(() => {
    props.loadLeaderboard(match.params.group);
    const q = queryString.parse(location.search);
    if (q.team1 && q.team2) {
      searchNow();
    }
  }, []);

  const handlePlayerPick = s => {
    setState(s);
    // reset
    setScores({});
    setSearched(false);
  };
  const [state, setState] = useState(getInitState());
  const [scores, setScores] = useState({});
  const [searched, setSearched] = useState(false);

  const divRef = useRef<any>();
  const searchNow = () => {
    SearchScore({
      groupId: match.params.group,
      tourId: match.params.tour,
      ...state
    }).then(result => {
      setQuery({
        team1: Object.keys(state.winners).join("|"),
        team2: Object.keys(state.losers).join("|")
      });
      setSearched(true);
      setScores(result);
      console.log(result);
      if (divRef.current) {
        divRef.current.scrollIntoView({ behavior: "smooth" });
      }
    });
  };

  const validateAndSubmit = e => {
    e.preventDefault();
    searchNow();
  };

  useEffect(() => {
    setState(current => {
      return {
        ...current,
        formValid:
          Object.keys(state.winners).length > 0 &&
          Object.keys(state.winners).length <= 2 &&
          Object.keys(state.losers).length > 0 &&
          Object.keys(state.losers).length <= 2 &&
          Object.keys(state.losers).length === Object.keys(state.winners).length
      };
    });
  }, [state.winners, state.losers]);
  const getVs = () =>
    `${getPlayersAsText(state.winners, playersAsObject)} vs. ${getPlayersAsText(
      state.losers,
      playersAsObject
    )}`;

  return (
    <>
      {group ? (
        <>
          <RouteNav
            history={history}
            center="View Head 2 Head Result"
            right={
              <DropDownMenu
                icon={<FaEllipsisV />}
                options={[
                  <ShareLink
                    title={getVs()}
                    text={`Check out ${getVs()} H2H`}
                    url={window.location.href}
                  />
                ]}
              />
            }
          ></RouteNav>
          <div className="pb-3 px-2">
            <form noValidate onSubmit={validateAndSubmit}>
              <div className="mt-3">
                <PlayerPicker
                  players={players}
                  state={state}
                  setValue={handlePlayerPick}
                  winnerText="Team 1"
                  loserText="Team 2"
                />
              </div>

              <div className="text-center pt-3 py-2">
                <UpdateButton
                  loading={pendingRequests}
                  loadingText="Saving..."
                  value="View H2H Results"
                  type="submit"
                  disabled={!state.formValid || pendingRequests > 0}
                  className="btn btn-primary btn-sm btn-block"
                ></UpdateButton>
              </div>
            </form>
          </div>
          <div ref={divRef} style={{ float: "left", clear: "both" }}></div>
          {state.formValid && Object.keys(scores).length ? (
            <>
              <HeaderCard>
                {getPlayers(state.winners, playersAsObject)} vs.{" "}
                {getPlayers(state.losers, playersAsObject)}
              </HeaderCard>
              <div className="mt-5">
                <Head2HeadChart
                  scores={scores}
                  winners={state.winners}
                  losers={state.losers}
                  players={playersAsObject}
                />
              </div>
              <HeaderCard>Results</HeaderCard>
              <div className="pb-5 mx-2">
                {getSortedResult(scores).map(k => (
                  <ResultCard
                    key={k["id"]}
                    showFullDate={true}
                    hideMenu={true}
                    players={playersAsObject}
                    {...(k as any)}
                  ></ResultCard>
                ))}
              </div>
            </>
          ) : searched && state.formValid ? (
            <div className="text-center pb-3 px-2 text-muted small">
              <em>No Result Found</em>
            </div>
          ) : null}
        </>
      ) : null}
    </>
  );
};

export default ViewHead2Head;
