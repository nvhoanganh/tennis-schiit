import React, { useEffect, useState } from "react";
import UpdateButton from "./LoadingButton";
import TextInput from "./TextInput";
import RouteNav from "./RouteNav";
import { isValidEmail } from "@tennis-score/core";
import { maxContainer } from "./common";
const AddPlayer = ({
  addPlayer,
  group,
  history,
  match,
  pendingRequests,
  ...props
}) => {
  useEffect(() => {
    props.loadGroups();
    props.loadLeaderboard(match.params.group);
  }, []);
  const [state, setState] = useState({
    email: "",
    emailValid: false,
    name: "",
    nameValid: false,
    formValid: false
  });
  const setValue = (field, value) =>
    setState(curr => ({ ...curr, [field]: value }));

  const validateAndSubmit = e => {
    e.preventDefault();
    addPlayer({
      ...state,
      playerId: "",
      groupId: match.params.group
    }).then(_ => history.goBack());
  };

  useEffect(() => {
    setState(current => {
      const newS = {
        ...current,
        nameValid: !!state.name,
        emailValid: isValidEmail(state.email)
      };
      return {
        ...newS,
        formValid: newS.nameValid && newS.emailValid
      };
    });
  }, [state.name, state.email]);

  if (!group) return null;
  return (
    <>
      <RouteNav
        history={history}
        center={group.name.toUpperCase() + " - New Player"}
      ></RouteNav>
      <div {...maxContainer}>
        <form noValidate onSubmit={validateAndSubmit}>
          <TextInput
            type="email"
            name="email"
            label="Player Email"
            value={state.email}
            placeholder="Player email"
            errorMessage="Valid email is required"
            setValue={setValue}
            isValid={state.emailValid}
          ></TextInput>

          <TextInput
            type="text"
            name="name"
            label="Player Name"
            value={state.name}
            placeholder="Player Name"
            errorMessage="Name is required"
            setValue={setValue}
            isValid={state.nameValid}
          ></TextInput>

          <div className="row pt-4">
            <div className="col-md-6">
              <div className="form-group">
                <UpdateButton
                  loading={pendingRequests > 0}
                  loadingText="Saving..."
                  value="Add Player"
                  type="submit"
                  disabled={!state.formValid || pendingRequests > 0}
                  className="btn btn-primary btn-block"
                ></UpdateButton>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddPlayer;
