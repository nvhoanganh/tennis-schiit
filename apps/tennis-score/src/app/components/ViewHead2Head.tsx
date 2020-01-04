import React, { useEffect, useState } from "react";
import { maxContainer } from "./common";
import UpdateButton from "./LoadingButton";
import { PlayerPicker } from "./PlayerPicker";
import RouteNav from "./RouteNav";
import SelectInput from "./SelectInput";
import { SearchScore } from "@tennis-score/redux";
import ResultCard from "./ResultCard";
import HeaderCard from "./Header";

const ViewHead2Head = ({
  pendingRequests,
  group,
  players,
  playersAsObject,
  match,
  submitScore,
  history,
  ...props
}) => {
  useEffect(() => {
    props.loadLeaderboard(match.params.group);
  }, []);

  const initState = {
    winners: {},
    losers: {},
    formValid: false
  };
  const [state, setState] = useState(initState);
  const [scores, setScores] = useState({});
  const [searched, setSearched] = useState(false);

  const validateAndSubmit = e => {
    e.preventDefault();
    SearchScore({
      groupId: match.params.group,
      tourId: match.params.tour,
      ...state
    }).then(result => {
      setSearched(true);
      console.log(players);
      console.log(result);
      setScores(result);
    });
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
            center="View Head 2 Head Results"
          ></RouteNav>
          <div className="pb-3 px-2">
            <form noValidate onSubmit={validateAndSubmit}>
              <div className="mt-3">
                <PlayerPicker
                  players={players}
                  state={state}
                  setValue={setState}
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
          {Object.keys(scores).length ? (
            <>
              <HeaderCard>Previous Results</HeaderCard>
              <div>
                {Object.keys(scores).map(k => (
                  <ResultCard
                    key={k}
                    players={playersAsObject}
                    {...scores[k]}
                  ></ResultCard>
                ))}
              </div>
            </>
          ) : searched ? (
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
