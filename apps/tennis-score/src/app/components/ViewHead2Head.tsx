import { getPlayersName, SearchScore } from "@tennis-score/redux";
import queryString from "query-string";
import React, { useEffect, useRef, useState } from "react";
import setQuery from "set-query-string";
import { Head2HeadChart } from "./Head2HeadChart";
import HeaderCard from "./Header";
import UpdateButton from "./LoadingButton";
import { PlayerPicker } from "./PlayerPicker";
import ResultCard from "./ResultCard2";
import RouteNav from "./RouteNav";
const getPlayers = (p, allP) => (
  <span>{getPlayersName(p, allP).join("/")}</span>
);
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
      let toretun = {
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
      divRef.current.scrollIntoView({ behavior: "smooth" });
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
  return (
    <>
      {group ? (
        <>
          <RouteNav
            history={history}
            center="View Head 2 Head Result"
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
              <HeaderCard className="sticky first">
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
              <div className="pb-5">
                {Object.keys(scores).map(k => (
                  <ResultCard
                    key={k}
                    hideMenu={true}
                    players={playersAsObject}
                    {...scores[k]}
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
