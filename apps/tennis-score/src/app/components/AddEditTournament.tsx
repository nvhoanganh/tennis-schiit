import React, { useEffect, useState } from "react";
import { maxContainer } from "./common";
import UpdateButton from "./LoadingButton";
import RouteNav from "./RouteNav";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import * as R from "ramda";
import { isNumber } from "util";
import { isValidNumber } from "@tennis-score/core";
import {
  SORT_TRUESKILL,
  SORT_PRIZEMONEY,
  SORT_WINPERCENT
} from "@tennis-score/redux";
import { format } from "date-fns";

const AddEditTournament = ({
  loading,
  history,
  group,
  match,
  tournament,
  ...props
}) => {
  useEffect(() => {
    props.loadLeaderboard(match.params.group);
  }, []);

  useEffect(() => {
    if (tournament && match.params.tour) {
      const d = format(tournament.startDate.toDate(), "yyyy-MM-dd");
      setState(current => ({
        ...tournament,
        startDate: d,
        prizeValid: true,
        startDateValid: true
      }));
    }
  }, [tournament]);

  const [state, setState] = useState({
    // required
    description: "",
    prize: "5",
    prizeValid: true,
    sortBy: "",
    startDate: "",
    startDateValid: false,
    formValid: false
  });

  const setValue = (field, value) => {
    setState(curr => ({ ...curr, [field]: value }));
  };

  useEffect(() => {
    setState(current => {
      const newS = {
        ...current,
        prizeValid: isValidNumber(state.prize),
        startDateValid: !!state.startDate
      };
      return {
        ...newS,
        formValid: newS.startDateValid && newS.prizeValid
      };
    });
  }, [state.startDate, state.prize, state.description, state.sortBy]);

  const validateAndSubmit = e => {
    e.preventDefault();
    if (state.formValid) {
      props
        .addTournament({
          ...state,
          tournamentId: match.params.tour,
          group
        })
        .then(_ => history.goBack());
    }
  };

  return (
    <>
      <RouteNav
        history={history}
        center={
          tournament && match.params.tour ? "Edit Tournament" : "Add Tournament"
        }
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
            type="text"
            name="prize"
            label="Prize per match"
            value={state.prize}
            placeholder=""
            errorMessage="Enter valid amount"
            setValue={setValue}
            isValid={state.prizeValid}
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

          <SelectInput
            name="sortBy"
            label="Rank players using"
            value={state.sortBy}
            placeholder="Select ..."
            errorMessage="Please select"
            setValue={setValue}
            isValid={true}
            options={[SORT_TRUESKILL, SORT_WINPERCENT, SORT_PRIZEMONEY]}
          ></SelectInput>

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
