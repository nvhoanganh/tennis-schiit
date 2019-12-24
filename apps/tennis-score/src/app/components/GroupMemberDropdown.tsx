import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isMember, isOwner } from "@tennis-score/redux";
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { LinkContainer } from "react-router-bootstrap";
export function GroupMemberDropdown({ user, group }) {
  return (
    <DropdownButton
      drop="left"
      variant="light"
      title={<FontAwesomeIcon icon={faEllipsisV} />}
      id="group-menu"
    >
      {!isMember(user, group) && <Dropdown.Item>Join Group</Dropdown.Item>}
      {!isOwner(user, group) && isMember(user, group) && (
        <Dropdown.Item>Leave Group</Dropdown.Item>
      )}
      <Dropdown.Item>View Scores</Dropdown.Item>
      {isOwner(user, group) && (
        <>
          <Dropdown.Divider />
          <LinkContainer to={`/managegroup/${group.groupId}`}>
            <Dropdown.Item>Manage Group</Dropdown.Item>
          </LinkContainer>
        </>
      )}
    </DropdownButton>
  );
}
