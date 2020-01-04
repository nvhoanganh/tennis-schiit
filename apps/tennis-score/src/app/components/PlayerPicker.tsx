import React, { useState } from "react";
import RoundGravatar from "./RoundGravatar";
import CheckBoxInput from "./CheckBoxInput";
export function PlayerPicker({ players, state, setValue }) {
  const setValueHandler = (field, value) => {
    const user = field.split("_")[1];
    const inverse = field.split("_")[0] === "w" ? "l" : "w";
    const inverseK = inverse + "_" + user;
    // calculate
    let ns = null;
    if (value && state[inverseK]) {
      ns = {
        ...state,
        [field]: value,
        [inverseK]: false
      };
    } else {
      ns = { ...state, [field]: value };
    }
    let winners = {};
    let losers = {};
    Object.keys(ns).forEach(k => {
      if ((k.startsWith("w_") || k.startsWith("l_")) && ns[k]) {
        if (k.startsWith("w_") && ns[k]) {
          winners[k.split("_")[1]] = true;
        }
        if (k.startsWith("l_") && ns[k]) {
          losers[k.split("_")[1]] = true;
        }
      }
    });
    setValue({ ...ns, winners, losers });
  };

  return (
    <table className="table table-borderless pb-3">
      <thead>
        <tr>
          <td></td>
          <td className="text-center font-weight-bold">Winner</td>
          <td className="text-center font-weight-bold">Loser</td>
        </tr>
      </thead>
      <tbody>
        {players.map(p => (
          <tr className="shadow-sm bg-white rounded border" key={p.id}>
            <td>
              <div className="row ml-2">
                <div className="">
                  <RoundGravatar
                    size={37}
                    avatarUrl={p.avatarUrl}
                    email={p.email || "0"}
                  />
                </div>
                <div className="ml-2 font-weight-bold mr-auto mt-1">
                  {p.name}
                </div>
              </div>
            </td>

            <td className="text-center">
              <CheckBoxInput
                name={`w_${p.id}`}
                label=""
                value={state[`w_${p.id}`] || false}
                setValue={setValueHandler}
              ></CheckBoxInput>
            </td>
            <td className="text-center">
              <CheckBoxInput
                name={`l_${p.id}`}
                label=""
                value={state[`l_${p.id}`] || false}
                setValue={setValueHandler}
              ></CheckBoxInput>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
