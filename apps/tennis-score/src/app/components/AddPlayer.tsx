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
    props.loadLeaderboard(match.params.group);
  }, []);
  const initState = {
    email: "",
    emailValid: true,
    name: "",
    nameValid: false,
    formValid: false
  };
  const [state, setState] = useState(initState);
  const setValue = (field, value) =>
    setState(curr => ({ ...curr, [field]: value }));

  const saveAndThenAddNew = _ => {
    addPlayer({
      ...state,
      group,
      groupId: match.params.group
    }).then(_ => {
      setState(initState);
    });
  };
  const validateAndSubmit = e => {
    e.preventDefault();
    addPlayer({
      ...state,
      group,
      groupId: match.params.group
    }).then(_ => {
      history.goBack();
    });
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
      <RouteNav history={history} center="Add New Player"></RouteNav>
      <div {...maxContainer}>
        <form noValidate onSubmit={validateAndSubmit}>
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

          <TextInput
            type="email"
            name="email"
            label="Player Email"
            value={state.email}
            placeholder="Player email (Optional)"
            errorMessage="Valid email is required"
            setValue={setValue}
            isValid={state.emailValid}
          ></TextInput>

          <div className="row pt-4">
            <div className="col-12">
              <div className="form-group">
                <UpdateButton
                  loading={pendingRequests}
                  loadingText="Saving..."
                  value="Add Player"
                  type="submit"
                  disabled={!state.formValid || pendingRequests}
                  className="btn btn-primary btn-sm btn-block"
                ></UpdateButton>
              </div>
            </div>
            <div className="col-12">
              <div className="form-group">
                <UpdateButton
                  loading={pendingRequests}
                  loadingText="Saving..."
                  value="Add Player + another"
                  type="button"
                  onClick={saveAndThenAddNew}
                  disabled={!state.formValid || pendingRequests}
                  className="btn btn-dark btn-sm btn-block"
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
