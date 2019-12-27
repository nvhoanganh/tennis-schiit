import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import CheckBoxInput from "./CheckBoxInput";
import UpdateButton from "./LoadingButton";
import RoundGravatar from "./RoundGravatar";
import RouteNav from "./RouteNav";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import RadioInput from "./RadioInput";
import RadioInputButton from "./RadioInputButtons";

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

  const [state, setState] = useState({
    gameWonByLostTeam: "3",
    reverseBagel: false,
    winners: {},
    losers: {},
    matchDate: format(new Date(), "yyyy-MM-dd"),
    matchDateValid: null,
    formValid: false
  });

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
      return { ...ns, winners, losers };
    });
  };

  const validateAndSubmit = e => {
    e.preventDefault();
    submitScore({
      ...state,
      groupId: group.groupId,
      group,
      currentTournament: group.currentTournament
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
          Object.keys(state.losers).length > 0 &&
          Object.keys(state.losers).length === Object.keys(state.winners).length
      };
    });
  }, [state.gameWonByLostTeam, state.matchDate, state.winners, state.losers]);
  return (
    <>
      {group ? (
        <>
          <RouteNav
            history={history}
            center="Submit New Result"
          ></RouteNav>
          <div className="container">
            <form noValidate onSubmit={validateAndSubmit}>
              <div className="card mt-3">
                <div className="card-body">
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
                        <tr key={p.id}>
                          <td>
                            <div className="row">
                              <div className="">
                                <RoundGravatar
                                  size={37}
                                  email={p.email || "0"}
                                />
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
                    label="Reversed Bagel?"
                    value={state.reverseBagel}
                    setValue={setValue}
                  ></CheckBoxInput>
                </div>
              </div>
              <div className="text-center py-3">
                <UpdateButton
                  loading={pendingRequests > 0}
                  loadingText="Saving..."
                  value="Submit"
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

export default EntryForm;
