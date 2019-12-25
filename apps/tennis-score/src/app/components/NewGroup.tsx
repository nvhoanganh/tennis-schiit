import React, { useEffect, useState, useRef } from "react";
import TextInput from "./TextInput";
import UpdateButton from "./LoadingButton";
import FileInput from "./FileInput";
import AddressLookup from "./AddressLookup";

const NewGroup = ({ loading, history, addGroup }) => {
  const [state, setState] = useState({
    name: "",
    nameValid: false,
    location: "",
    locationLongLat: null,
    locationValid: false,
    description: "",
    image: null,
    formValid: false
  });

  const setValue = (field, value) => {
    setState(curr => ({ ...curr, [field]: value }));
  };

  useEffect(() => {
    setState(current => {
      console.log(current);
      return {
        ...current,
        nameValid: !!state.name,
        locationValid: !!state.locationLongLat && !!state.location,
        formValid: !!state.name
      };
    });
  }, [state.name, state.image, state.location, state.locationLongLat, state.location]);

  const validateAndSubmit = e => {
    e.preventDefault();
    if (state.formValid) {
      addGroup(state).then(_ => history.goBack());
    }
  };

  return (
    <div className="mt-4 mx-4">
      <h4 className="card-title mb-4 mt-1">Create New Group</h4>
      <form noValidate onSubmit={validateAndSubmit}>
        <TextInput
          type="text"
          name="name"
          label="Group Name"
          value={state.name}
          placeholder="Group Name"
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
          name="image"
          label="Group Photo"
          errorMessage=""
          setValue={setValue}
          isValid={true}
        ></FileInput>

        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <UpdateButton
                loading={loading}
                value="Create new group"
                type="submit"
                disabled={!state.formValid || loading}
                className="btn btn-primary btn-block"
              ></UpdateButton>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewGroup;
