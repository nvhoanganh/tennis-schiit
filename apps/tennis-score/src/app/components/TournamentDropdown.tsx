import { faEllipsisV, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isMember, isOwner } from "@tennis-score/redux";
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { LinkContainer } from "react-router-bootstrap";
export function TournamentDropDown({ user, group }) {
  return (
    <DropdownButton
      drop="left"
      variant="link"
      size="sm"
      title={<FontAwesomeIcon icon={faEllipsisH} />}
      id="group-menu"
    >
      <Dropdown.Item>View Results</Dropdown.Item>
      {isOwner(user, group) && (
        <>
          <Dropdown.Divider />
          <Dropdown.Item>Stop current tournament</Dropdown.Item>
          <Dropdown.Item>Add new tournament</Dropdown.Item>
        </>
      )}
    </DropdownButton>
  );
}
