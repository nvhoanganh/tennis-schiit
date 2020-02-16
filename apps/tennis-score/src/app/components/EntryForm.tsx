import format from "date-fns/format";
import React, { useEffect, useState } from "react";
import CheckBoxInput from "./CheckBoxInput";
import { maxContainer } from "./common";
import UpdateButton from "./LoadingButton";
import { PlayerPicker } from "./PlayerPicker";
import RadioInputButton from "./RadioInputButtons";
import RouteNav from "./RouteNav";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";

const EntryForm = ({
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
    gameWonByLostTeam: "3",
    reverseBagel: false,
    headStart: 0,
    winners: {},
    losers: {},
    matchDate: format(new Date(), "yyyy-MM-dd"),
    matchDateValid: null,
    formValid: false
  };
  const [state, setState] = useState(initState);
  const setValue = (field, value) => {
    setState(curr => {
      let toreturn = { ...curr, [field]: value };
      if (field === "gameWonByLostTeam" && value === "0") {
        toreturn = { ...toreturn, reverseBagel: false };
      }
      return toreturn;
    });
  };

  const submitAndAddNew = _ => {
    submitScore({
      ...state,
      group
    }).then(_ => {
      setState(initState);
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
      const newS = {
        ...current,
        matchDateValid: !!current.matchDate
      };
      return {
        ...newS,
        formValid:
          newS.matchDateValid &&
          Object.keys(state.winners).length > 0 &&
          Object.keys(state.winners).length <= 2 &&
          Object.keys(state.losers).length > 0 &&
          Object.keys(state.losers).length <= 2 &&
          Object.keys(state.losers).length === Object.keys(state.winners).length
      };
    });
  }, [state.gameWonByLostTeam, state.matchDate, state.winners, state.losers]);
  return (
    <>
      {group ? (
        <>
          <RouteNav history={history} center="Submit New Result"></RouteNav>
          <div {...maxContainer}>
            <form noValidate onSubmit={validateAndSubmit}>
              <div className="mt-3">
                <PlayerPicker
                  players={players}
                  state={state}
                  setValue={setState}
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

                <RadioInputButton
                  name="gameWonByLostTeam"
                  label="Games won by losing team"
                  value={state.gameWonByLostTeam}
                  errorMessage=""
                  setValue={setValue}
                  options={["0", "1", "2", "3", "4", "5", "6"]}
                  isValid={true}
                ></RadioInputButton>
                <TextInput
                  type="date"
                  name="matchDate"
                  label="Date"
                  value={state.matchDate}
                  placeholder=""
                  errorMessage=""
                  setValue={setValue}
                  isValid={state.matchDateValid}
                ></TextInput>
                <CheckBoxInput
                  name="reverseBagel"
                  disabled={state.gameWonByLostTeam === "0"}
                  label="Reversed Bagel?"
                  value={state.reverseBagel}
                  setValue={setValue}
                ></CheckBoxInput>
              </div>

              <div className="text-center pt-3 py-2">
                <UpdateButton
                  loading={pendingRequests}
                  loadingText="Saving..."
                  value="Submit"
                  type="submit"
                  disabled={!state.formValid || pendingRequests > 0}
                  className="btn btn-primary btn-sm btn-block"
                ></UpdateButton>
              </div>

              <div className="text-center pb-3">
                <UpdateButton
                  loading={pendingRequests}
                  loadingText="Saving..."
                  value="Submit + Add another"
                  onClick={submitAndAddNew}
                  type="button"
                  disabled={!state.formValid || pendingRequests > 0}
                  className="btn btn-dark btn-sm btn-block"
                ></UpdateButton>
              </div>
            </form>
          </div>
        </>
      ) : null}
    </>
  );
};

export default EntryForm;
