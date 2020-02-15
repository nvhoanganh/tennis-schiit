import { IconButton } from "@chakra-ui/core";
import React from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaHandshake,
  FaFemale,
  FaHandRock,
  FaMale,
  FaUserGraduate
} from "react-icons/fa";
import { faHandshake } from '@fortawesome/free-solid-svg-icons';
function UserInfo({ icon, text }) {
  return (
    <div className="col-3 text-center p-2">
      <div className="p-2">
        <IconButton
          aria-label=""
          isRound={true}
          icon={icon}
          size="lg"
          className="shadow-sm"
        />
        <p className="text-muted mt-2 small">{text}</p>
      </div>
    </div>
  );
}

function PlayerSettings({ user }) {
  return (
    <div className="row mx-2">
      <UserInfo
        icon={user.singleHandedBackhand ? FaHandRock : FaHandshake}
        text={
          user.singleHandedBackhand ? "Single Backhand" : "2Handed Backhand"
        }
      />
      <UserInfo
        icon={user.leftHanded ? FaArrowLeft : FaArrowRight}
        text={user.leftHanded ? "Left Handed" : "Right Handed"}
      />
      <UserInfo icon={FaUserGraduate} text={user.level || "Competent"} />
      <UserInfo
        icon={user.gender === "Male" || !user.gender ? FaMale : FaFemale}
        text={user.gender || "Male"}
      />
    </div>
  );
}

export default PlayerSettings;
