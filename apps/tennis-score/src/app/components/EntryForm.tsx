import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import CheckBoxInput from "./CheckBoxInput";
import { maxContainer } from "./common";
import UpdateButton from "./LoadingButton";
import RadioInputButton from "./RadioInputButtons";
import RoundGravatar from "./RoundGravatar";
import RouteNav from "./RouteNav";
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
    props.loadGroups();
    props.loadLeaderboard(match.params.group);
  }, []);

  const initState = {
    gameWonByLostTeam: "3",
    reverseBagel: false,
    winners: {},
    losers: {},
    matchDate: format(new Date(), "yyyy-MM-dd"),
    matchDateValid: null,
    formValid: false
  };
  const [state, setState] = useState(initState);

  const setValue = (field, value) => {
    const user = field.split("_")[1];
    const inverse = field.split("_")[0] === "w" ? "l" : "w";
    const inverseK = inverse + "_" + user;
    setState(curr => {
      let ns = null;
      if (value && curr[inverseK]) {
        ns = {
          ...curr,
          [field]: value,
          [inverseK]: false
        };
      } else {
        ns = { ...curr, [field]: value };
      }
      let winners = {};
      let losers = {};
      Object.keys(ns).forEach(k => {
        if ((k.startsWith("w_") || k.startsWith("l_")) && ns[k]) {
          if (k.startsWith("w_") && ns[k]) {
            winners[k.split("_")[1]] = true;
          }
          if (k.startsWith("l_") && ns[k]) {
            losers[k.split("_")[1]] = true;
          }
        }
      });
      let toreturn = { ...ns, winners, losers };
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
                <table className="table table-borderless pb-3">
                  <thead>
                    <tr>
                      <td></td>
                      <td className="text-center font-weight-bold">Winner</td>
                      <td className="text-center font-weight-bold">Loser</td>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map(p => (
                      <tr
                        className="shadow-sm bg-white rounded border"
                        key={p.id}
                      >
                        <td>
                          <div className="row ml-2">
                            <div className="">
                              <RoundGravatar size={37} email={p.email || "0"} />
                            </div>
                            <div className="ml-2 font-weight-bold mr-auto mt-1">
                              {p.name}
                            </div>
                          </div>
                        </td>

                        <td className="text-center">
                          <CheckBoxInput
                            name={`w_${p.id}`}
                            label=""
                            value={state[`w_${p.id}`] || false}
                            setValue={setValue}
                          ></CheckBoxInput>
                        </td>
                        <td className="text-center">
                          <CheckBoxInput
                            name={`l_${p.id}`}
                            label=""
                            value={state[`l_${p.id}`] || false}
                            setValue={setValue}
                          ></CheckBoxInput>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

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
