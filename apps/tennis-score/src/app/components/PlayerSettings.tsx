import {
  faHandPaper,
  faHandRock,
  faMars,
  faUserGraduate,
  faVenus,
  faUserAstronaut
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button } from "./Button";

function UserInfo({ icon, text }) {
  return (
    <div className="col-3 text-center p-2">
      <div className="p-2">
        <Button
          type="button"
          className="btn btn-link btn-sm text-dark border rounded-circle shadow-sm h2"
        >
          <FontAwesomeIcon icon={icon} className="text-dark" />
        </Button>
        <p className="text-muted x-small">{text}</p>
      </div>
    </div>
  );
}

function PlayerSettings({ user }) {
  return (
    <div className="row">
      <UserInfo
        icon={faHandRock}
        text={
          user.singleHandedBackhand ? "Single Backhand" : "Two Handed Backhand"
        }
      />
      <UserInfo
        icon={faHandPaper}
        text={user.leftHanded ? "Left Handed" : "Right Handed"}
      />
      <UserInfo icon={faUserGraduate} text={user.level || "Competent"} />
      <UserInfo icon={faUserAstronaut} text={user.gender || "Male"} />
    </div>
  );
}

export default PlayerSettings;
