import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isMember, isOwner } from "@tennis-score/redux";
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

export function GroupMemberDropdown({ user, group }) {
  return (
    <DropdownButton
      drop="left"
      variant="light"
      title={<FontAwesomeIcon icon={faEllipsisV} />}
      id="group-menu"
    >
      {!isMember(user, group) && <Dropdown.Item>Join Group</Dropdown.Item>}
      {isMember(user, group) && <Dropdown.Item>Leave Group</Dropdown.Item>}
      <Dropdown.Item>View Scores</Dropdown.Item>
      {isOwner(user, group) && (
        <>
          <Dropdown.Divider />
          <Dropdown.Item>Manage Group</Dropdown.Item>
        </>
      )}
    </DropdownButton>
  );
}
