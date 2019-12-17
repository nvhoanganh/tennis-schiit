import { Mocked_Players } from "@tennis-score/api-interfaces";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Gravatar from "react-gravatar";
import { UpdateButton } from "./Button";
import CheckBoxInput from "./CheckBoxInput";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";

const EntryForm = ({
  pendingRequests,
  group,
  user,
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
    gameWonByLostTeam: "0",
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
      {group && user ? (
        <div className="container">
          <h4 className="text-center pt-3">
            {group.name.toUpperCase()} - New Score
          </h4>
          <form noValidate onSubmit={validateAndSubmit}>
            <div className="card">
              <div className="card-body">
                <Table size="sm">
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
                            <div className="ml-3">
                              <Gravatar email={p.email} size={37} />
                            </div>
                            <div className="ml-2 mr-auto mt-1">{p.name}</div>
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
                </Table>
              </div>
            </div>

            <div className="card mt-3">
              <div className="card-body">
                <SelectInput
                  name="gameWonByLostTeam"
                  label="Set won by losing team"
                  value={state.gameWonByLostTeam}
                  placeholder="Display Name"
                  errorMessage=""
                  setValue={setValue}
                  isValid={true}
                  options={["0", "1", "2", "3", "4", "5", "6"]}
                ></SelectInput>
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
                  label="Reverse Bagel?"
                  value={state.reverseBagel}
                  setValue={setValue}
                ></CheckBoxInput>
              </div>
            </div>
            <div className="text-center py-3">
              <UpdateButton
                saving={pendingRequests > 0}
                savingText="Saving..."
                normalText="Submit"
                type="submit"
                disabled={!state.formValid || pendingRequests > 0}
                className="btn btn-primary btn-block"
              ></UpdateButton>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
};

EntryForm.defaultProps = {
  players: Mocked_Players
};
export default EntryForm;
