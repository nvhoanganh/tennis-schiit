import { Avatar, Button } from "@chakra-ui/core";
import {
  faSearchMinus,
  faSearchPlus,
  faSyncAlt
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getUrlAvatar } from "@tennis-score/redux";
import React, { useEffect, useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { LinkContainer } from "react-router-bootstrap";
import CheckBoxInput from "./CheckBoxInput";
import { maxContainer } from "./common";
import FloatingFileInput from "./FloatingFileInput";
import { Link } from "./Link";
import UpdateButton from "./LoadingButton";
import RouteNav from "./RouteNav";
import TextInput from "./TextInput";

const EditProfile = ({ user, updateProfile, history, pendingRequests }) => {
  const avatarRef = useRef<any>(null);
  const [state, setState] = useState({
    email: "",
    displayName: "",
    displayNameValid: false,
    leftHanded: false,
    singleHandedBackhand: false,
    photo: null,
    rotate: 0,
    zoom: 1.2,
    formValid: false
  });
  const setValue = (field, value) =>
    setState(curr => ({ ...curr, [field]: value }));

  const validateAndSubmit = e => {
    e.preventDefault();
    let profile = {
      uid: user.uid,
      displayName: state.displayName,
      leftHanded: state.leftHanded,
      singleHandedBackhand: state.singleHandedBackhand,
      history,
      avatar: ""
    };
    if (state.photo) {
      profile.avatar = avatarRef.current.getImageScaledToCanvas().toDataURL();
    }
    updateProfile(profile).then(_ => history.push("/account-details"));
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
      <RouteNav
        history={history}
        hideBack={!user.profileUpdated}
        center="Update my profile"
      ></RouteNav>
      <div {...maxContainer}>
        <form noValidate onSubmit={validateAndSubmit}>
          {!state.photo ? (
            <>
              <div className="d-flex justify-content-center">
                <Avatar
                  size="2xl"
                  name={user.displayName}
                  className="m-auto"
                  src={getUrlAvatar(user.uid)}
                />
              </div>
              <div className="d-flex justify-content-center pt-1">
                <FloatingFileInput
                  name="photo"
                  errorMessage=""
                  setValue={setValue}
                  disabled={false}
                  isValid={true}
                  button={
                    <Button size="sm" leftIcon="edit" variant="outline">
                      edit
                    </Button>
                  }
                ></FloatingFileInput>
              </div>
            </>
          ) : null}
          <div>
            {state.photo && (
              <>
                <div className="mr-auto border shadow-sm">
                  <AvatarEditor
                    ref={avatarRef}
                    image={state.photo}
                    width={200}
                    borderRadius={100}
                    height={200}
                    border={50}
                    color={[255, 255, 255, 0.6]} // RGBA
                    scale={state.zoom}
                    rotate={state.rotate}
                  />
                </div>
                <div className="py-2 mx-auto text-center">
                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      onClick={() =>
                        setValue("rotate", (90 + state.rotate) % 360)
                      }
                      className="btn btn-secondary"
                    >
                      <FontAwesomeIcon icon={faSyncAlt} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue("zoom", state.zoom + 0.2)}
                      className="btn btn-secondary"
                    >
                      <FontAwesomeIcon icon={faSearchPlus} />
                    </button>
                    <button
                      onClick={() => setValue("zoom", state.zoom - 0.2)}
                      type="button"
                      className="btn btn-secondary"
                    >
                      <FontAwesomeIcon icon={faSearchMinus} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
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
                  className="btn btn-primary btn-sm btn-block"
                ></UpdateButton>
              </div>
            </div>
            <div className="col-12 text-center">
              <LinkContainer to={`/account-details`}>
                <Link title="Cancel" className="small">
                  Cancel
                </Link>
              </LinkContainer>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProfile;
