import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isOwner, isMember } from "@tennis-score/redux";
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { LinkContainer } from "react-router-bootstrap";
export function TournamentDropDown({ user, group, tournament }) {
  const canSubmitNewScore = () => user && isMember(user, group) && tournament;
  if (!group) return null;

  return (
    <DropdownButton
      drop="left"
      variant="link"
      size="sm"
      title={<FontAwesomeIcon icon={faEllipsisH} />}
      id="group-menu"
    >
      {canSubmitNewScore() && (
        <LinkContainer to={`/newscore/${group.groupId}`}>
          <Dropdown.Item>Submit Result</Dropdown.Item>
        </LinkContainer>
      )}
      <LinkContainer
        to={`/groups/${group.groupId}/tournament/${group.currentTournament}/results`}
      >
        <Dropdown.Item>View Results</Dropdown.Item>
      </LinkContainer>
      {isOwner(user, group) && (
        <>
          <Dropdown.Divider />
          {tournament ? (
            <LinkContainer
              to={`/groups/${group.groupId}/tournament/${group.currentTournament}`}
            >
              <Dropdown.Item>Edit tournament</Dropdown.Item>
            </LinkContainer>
          ) : null}
          <LinkContainer to={`/groups/${group.groupId}/newtournament`}>
            <Dropdown.Item>Start new tournament</Dropdown.Item>
          </LinkContainer>
        </>
      )}
    </DropdownButton>
  );
}
