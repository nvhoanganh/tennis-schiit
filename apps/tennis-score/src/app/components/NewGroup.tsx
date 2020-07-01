import React, { useEffect, useState } from "react";
import AddressLookup from "./AddressLookup";
import FileInput from "./FileInput";
import UpdateButton from "./LoadingButton";
import TextInput from "./TextInput";
import { maxContainer } from "./common";
import RouteNav from "./RouteNav";
import { getGroupImageUrl } from "@tennis-score/redux";

const NewGroup = ({ loading, history, editGroup, addGroup, group }) => {
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
    photoValid: false,

    formValid: false
  });

  const setValue = (field, value) => {
    setState(curr => ({ ...curr, [field]: value }));
  };

  useEffect(() => {
    if (group) {
      setState(_ => ({
        ...group,
        photoValid: true
      }));
    }
  }, [group]);

  useEffect(() => {
    setState(current => {
      const newS = {
        ...current,
        nameValid: !!state.name,
        locationValid: !!state.locationLongLat && !!state.location,
        photoValid: state.photo
      };
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
      if (!group) {
        addGroup(state).then(_ => history.goBack());
      } else {
        editGroup({ ...state, group }).then(_ => history.goBack());
      }
    }
  };

  return (
    <>
      <RouteNav
        history={history}
        center={group ? "Edit Group" : "Create new group"}
      ></RouteNav>
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
            label="Court Location"
            errorMessage="Valid address is required"
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

          {group && (
            <div>
              <img
                alt="Group"
                src={getGroupImageUrl(group.groupImage, group.name)}
                style={{
                  height: 140,
                  objectFit: "cover"
                }}
                className="card-img-top border"
              ></img>
            </div>
          )}
          <FileInput
            multiple={false}
            name="photo"
            label={group ? "Change Group Photo" : "Group Photo"}
            errorMessage="Group photo is required"
            setValue={setValue}
            isValid={state.photoValid}
          ></FileInput>

          <div className="row">
            <div className="col-12">
              <div className="form-group">
                <UpdateButton
                  loading={loading}
                  value={group ? "Update Group" : "Create new group"}
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
