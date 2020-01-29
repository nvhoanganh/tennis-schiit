import {
  faHandPaper,
  faHandRock,
  faUserAstronaut,
  faUserGraduate
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button } from "./Button";
import { IconButton } from "@chakra-ui/core";

function UserInfo({ icon, text }) {
  return (
    <div className="col-3 text-center p-2">
      <div className="p-2">
        <IconButton
          aria-label=""
          isRound={true}
          icon="check-circle"
          className="shadow-sm"
        />
        {/* <Button
          type="button"
          className="btn btn-link btn-sm text-dark border rounded-circle shadow-sm h2"
        >
          <FontAwesomeIcon icon={icon} className="text-dark h2" />
        </Button>
         */}
        <p className="text-muted x-small mt-2">{text}</p>
      </div>
    </div>
  );
}

function PlayerSettings({ user }) {
  return (
    <div className="row mx-2">
      <UserInfo
        icon={faHandRock}
        text={
          user.singleHandedBackhand ? "Single Backhand" : "2-Handed Backhand"
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
