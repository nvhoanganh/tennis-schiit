import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isMember, isOwner } from "@tennis-score/redux";
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { LinkContainer } from "react-router-bootstrap";
export function GroupMemberDropdown({
  history,
  user,
  group,
  joinGroup,
  leaveGroup
}) {
  const joinHandler = _ => {
    if (!user) {
      history.push("/signin");
    } else {
      joinGroup(group.groupId);
    }
  };
  return (
    <DropdownButton
      drop="left"
      variant="link"
      size="sm"
      title={<FontAwesomeIcon icon={faEllipsisV} />}
      id="group-menu"
    >
      {!isMember(user, group) && (
        <Dropdown.Item onClick={joinHandler}>Join Group</Dropdown.Item>
      )}
      {isMember(user, group) && (
        <LinkContainer to={`/groups/${group.groupId}/newplayer`}>
          <Dropdown.Item>Add member</Dropdown.Item>
        </LinkContainer>
      )}
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
