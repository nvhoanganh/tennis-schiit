import React, { useEffect, useState } from "react";
import AddressLookup from "./AddressLookup";
import FileInput from "./FileInput";
import UpdateButton from "./LoadingButton";
import TextInput from "./TextInput";
import { maxContainer } from "./common";
import RouteNav from "./RouteNav";
import CheckBoxInput from "./CheckBoxInput";

const AddEditTournament = ({
  loading,
  history,
  group,
  match,
  tournament,
  ...props
}) => {
  useEffect(() => {
    props.loadGroups();
    props.loadLeaderboard(match.params.group);
  }, []);

  const [state, setState] = useState({
    // required
    description: "",
    startDate: "",
    startDateValid: false,
    endDate: "",
    double: true,
    formValid: false
  });

  const setValue = (field, value) => {
    setState(curr => ({ ...curr, [field]: value }));
  };

  useEffect(() => {
    setState(current => {
      const newS = {
        ...current,
        startDateValid: !!state.startDate
      };
      return {
        ...newS,
        formValid: newS.startDateValid
      };
    });
  }, [state.startDate]);

  const validateAndSubmit = e => {
    e.preventDefault();
    if (state.formValid) {
      console.log(state);
      props
        .addTournament({
          ...state,
          groupId: match.params.group
        })
        .then(_ => history.goBack());
    }
  };

  return (
    <>
      <RouteNav
        history={history}
        center={tournament ? "Edit Tournament" : "Add Tournament"}
      ></RouteNav>
      <div {...maxContainer}>
        <form noValidate onSubmit={validateAndSubmit}>
          <TextInput
            type="date"
            name="startDate"
            label="Start Date"
            value={state.startDate}
            placeholder="dd/mm/yyyy"
            errorMessage="Enter valid date"
            setValue={setValue}
            isValid={state.startDateValid}
          ></TextInput>

          <TextInput
            type="date"
            name="endDate"
            label="End Date"
            value={state.endDate}
            placeholder="dd/mm/yyyy"
            errorMessage=""
            setValue={setValue}
            isValid={true}
          ></TextInput>
          
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

          <CheckBoxInput
            name="double"
            label="Double Tournament"
            value={state.double}
            setValue={setValue}
          ></CheckBoxInput>

          <div className="row py-3">
            <div className="col-12">
              <div className="form-group">
                <UpdateButton
                  loading={loading}
                  value="Save"
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

export default AddEditTournament;
