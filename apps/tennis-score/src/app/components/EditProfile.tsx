import React, { useEffect, useState } from "react";
import CheckBoxInput from "./CheckBoxInput";
import { maxContainer } from "./common";
import UpdateButton from "./LoadingButton";
import RouteNav from "./RouteNav";
import TextInput from "./TextInput";
const EditProfile = ({ user, updateProfile, history, pendingRequests }) => {
  const [state, setState] = useState({
    email: "",
    displayName: "",
    displayNameValid: false,
    leftHanded: false,
    singleHandedBackhand: false,
    formValid: false
  });
  const setValue = (field, value) =>
    setState(curr => ({ ...curr, [field]: value }));

  const validateAndSubmit = e => {
    e.preventDefault();
    updateProfile({
      uid: user.uid,
      displayName: state.displayName,
      leftHanded: state.leftHanded,
      singleHandedBackhand: state.singleHandedBackhand,
      history
    });
  };

  useEffect(() => {
    setState(current => {
      const newS = {
        ...current,
        displayNameValid: !!current.displayName
      };
      return {
        ...newS,
        formValid: newS.displayNameValid
      };
    });
  }, [state.displayName]);

  useEffect(() => {
    setState(curr => ({
      ...curr,
      email: user.email,
      displayName: user.displayName || "",
      leftHanded: user.leftHanded || false,
      singleHandedBackhand: user.singleHandedBackhand || false
    }));
  }, [user]);

  return (
    <>
      <RouteNav history={history} center="Update my profile"></RouteNav>
      <div {...maxContainer}>
        <form noValidate onSubmit={validateAndSubmit}>
          <TextInput
            type="email"
            name="email"
            label="Email"
            disabled={true}
            value={state.email}
            placeholder="Email address"
            errorMessage="Valid email is required"
            setValue={setValue}
            isValid={true}
          ></TextInput>

          <TextInput
            type="text"
            name="displayName"
            label="Display Name"
            value={state.displayName}
            placeholder="Display Name"
            errorMessage=""
            setValue={setValue}
            isValid={state.displayNameValid}
          ></TextInput>

          <CheckBoxInput
            name="leftHanded"
            label="Play Left Hand?"
            value={state.leftHanded}
            setValue={setValue}
          ></CheckBoxInput>

          <CheckBoxInput
            name="singleHandedBackhand"
            label="Single Backhand?"
            value={state.singleHandedBackhand}
            setValue={setValue}
          ></CheckBoxInput>

          <div className="row pt-4">
            <div className="col-12">
              <div className="form-group">
                <UpdateButton
                  loading={pendingRequests > 0}
                  loadingText="Saving..."
                  value="Update Profile"
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

export default EditProfile;
