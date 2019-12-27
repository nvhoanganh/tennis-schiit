import React, { useEffect, useState } from "react";
import AddressLookup from "./AddressLookup";
import FileInput from "./FileInput";
import UpdateButton from "./LoadingButton";
import TextInput from "./TextInput";
import { maxContainer } from "./common";
import RouteNav from "./RouteNav";

const NewGroup = ({ loading, history, addGroup }) => {
  const [state, setState] = useState({
    // required
    name: "",
    nameValid: false,

    location: "",
    locationLongLat: null,
    locationValid: false,

    // optional
    description: "",
    photo: null,

    formValid: false
  });

  const setValue = (field, value) => {
    setState(curr => ({ ...curr, [field]: value }));
  };

  useEffect(() => {
    setState(current => {
      const newS = {
        ...current,
        nameValid: !!state.name,
        locationValid: !!state.locationLongLat && !!state.location
      };
      console.log("new state", newS);
      return {
        ...newS,
        formValid: newS.nameValid && newS.locationValid
      };
    });
  }, [
    state.name,
    state.photo,
    state.location,
    state.locationLongLat,
    state.location
  ]);

  const validateAndSubmit = e => {
    e.preventDefault();
    if (state.formValid) {
      addGroup(state).then(_ => history.goBack());
    }
  };

  return (
    <>
      <RouteNav history={history} center="Create new group"></RouteNav>
      <div {...maxContainer}>
        <form noValidate onSubmit={validateAndSubmit}>
          <TextInput
            type="text"
            name="name"
            label="Name"
            value={state.name}
            placeholder="Name"
            errorMessage="Name is required"
            setValue={setValue}
            isValid={state.nameValid}
          ></TextInput>

          <AddressLookup
            name="location"
            label="Location"
            errorMessage="Address is required"
            value={state.location}
            setValue={setValue}
            isValid={state.locationValid}
          ></AddressLookup>

          <TextInput
            type="text"
            name="description"
            label="Description"
            value={state.description}
            placeholder="Description (optional)"
            errorMessage=""
            setValue={setValue}
            isValid={true}
          ></TextInput>

          <FileInput
            multiple={false}
            name="photo"
            label="Group Photo"
            errorMessage=""
            setValue={setValue}
            isValid={true}
          ></FileInput>

          <div className="row">
            <div className="col-12">
              <div className="form-group">
                <UpdateButton
                  loading={loading}
                  value="Create new group"
                  type="submit"
                  disabled={!state.formValid || loading}
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

export default NewGroup;
