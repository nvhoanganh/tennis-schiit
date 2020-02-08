import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  useDisclosure
} from "@chakra-ui/core";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isMember, isOwner, isInstalled, shareLink } from "@tennis-score/redux";
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { LinkContainer } from "react-router-bootstrap";
import { ShareLink } from "./ShareLink";

export function TournamentDropDown({ user, group, tournament }) {
  const canSubmitNewScore = () => user && isMember(user, group) && tournament;
  if (!group) return null;
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <button
        onClick={onOpen}
        type="button"
        className="btn btn-link btn-sm text-dark"
      >
        <FontAwesomeIcon icon={faEllipsisH} />
      </button>
      <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody className="py-4 pb-5">
            {canSubmitNewScore() && (
              <LinkContainer to={`/newscore/${group.groupId}`}>
                <a className="h5 py-2 d-block">Submit Result</a>
              </LinkContainer>
            )}
            <LinkContainer
              to={`/headtohead/${group.groupId}/tournament/${group.currentTournament}`}
            >
              <a className="h5 py-2 d-block">Check Head 2 Head</a>
            </LinkContainer>

            <LinkContainer
              to={`/groups/${group.groupId}/tournament/${group.currentTournament}/results`}
            >
              <a className="h5 py-2 d-block">View Results</a>
            </LinkContainer>
            {isOwner(user, group) && (
              <>
                <Dropdown.Divider />
                {tournament ? (
                  <LinkContainer
                    to={`/groups/${group.groupId}/tournament/${group.currentTournament}`}
                  >
                    <a className="h5 py-2 d-block">Edit tournament</a>
                  </LinkContainer>
                ) : null}
                <LinkContainer to={`/groups/${group.groupId}/newtournament`}>
                  <a className="h5 py-2 d-block">Start new tournament</a>
                </LinkContainer>
              </>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
