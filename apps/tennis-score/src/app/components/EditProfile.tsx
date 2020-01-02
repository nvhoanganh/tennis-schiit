import React, { useEffect, useState, useRef } from "react";
import AvatarEditor from "react-avatar-editor";
import RoundGravatar from "./RoundGravatar";
import CheckBoxInput from "./CheckBoxInput";
import { maxContainer } from "./common";
import UpdateButton from "./LoadingButton";
import RouteNav from "./RouteNav";
import TextInput from "./TextInput";
import FileInput from "./FileInput";
const EditProfile = ({ user, updateProfile, history, pendingRequests }) => {
  const avatarRef = useRef<any>(null);
  const [state, setState] = useState({
    email: "",
    displayName: "",
    displayNameValid: false,
    leftHanded: false,
    singleHandedBackhand: false,
    photo: null,
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
      avatar: "" // existing
    };
    if (state.photo) {
      profile.avatar = avatarRef.current.getImageScaledToCanvas().toDataURL();
    }
    updateProfile(profile);
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
          <div className="text-center">
            <RoundGravatar
              size={150}
              avatarUrl={user.avatarUrl}
              email={user.email || "0"}
            />
          </div>
          <div>
            <div className="pb-1">Change Avatar</div>
            {state.photo && (
              <div className="mr-auto border shadow-sm">
                <AvatarEditor
                  ref={avatarRef}
                  image={state.photo}
                  width={200}
                  borderRadius={100}
                  height={200}
                  border={50}
                  color={[255, 255, 255, 0.6]} // RGBA
                  scale={1.2}
                  rotate={0}
                />
              </div>
            )}
            <FileInput
              multiple={false}
              name="photo"
              label=""
              errorMessage=""
              setValue={setValue}
              isValid={true}
            ></FileInput>
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
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProfile;
