import React, { useEffect, useState } from "react";
import { maxContainer } from "./common";
import UpdateButton from "./LoadingButton";
import { PlayerPicker } from "./PlayerPicker";
import RouteNav from "./RouteNav";
import SelectInput from "./SelectInput";

const ViewHead2Head = ({
  pendingRequests,
  group,
  players,
  match,
  submitScore,
  history,
  ...props
}) => {
  useEffect(() => {
    props.loadLeaderboard(match.params.group);
  }, []);

  const initState = {
    headStart: 0,
    winners: {},
    losers: {},
    formValid: false
  };
  const [state, setState] = useState(initState);
  const setValue = (field, value) => {
    setState(curr => {
      return { ...curr, [field]: value };
    });
  };

  const validateAndSubmit = e => {
    e.preventDefault();
    submitScore({
      ...state,
      group
    }).then(_ => {
      history.goBack();
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
          <RouteNav history={history} center="View Head 2 Head Results"></RouteNav>
          <div {...maxContainer}>
            <form noValidate onSubmit={validateAndSubmit}>
              <div className="mt-3">
                <PlayerPicker
                  players={players}
                  state={state}
                  setValue={setState}
                  winnerText="Team A"
                  loserText="Team B"
                />
                <SelectInput
                  name="headStart"
                  label="Handicap"
                  value={state.headStart}
                  placeholder=""
                  errorMessage=""
                  setValue={setValue}
                  isValid={true}
                  options={[
                    "-- no handicap --",
                    "1-0",
                    "2-0",
                    "3-0",
                    "0-1",
                    "0-2",
                    "0-3"
                  ]}
                  values={[0, 1, 2, 3, -1, -2, -3]}
                ></SelectInput>
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
        </>
      ) : null}
    </>
  );
};

export default ViewHead2Head;
