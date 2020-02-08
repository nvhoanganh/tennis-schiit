import { Drawer, DrawerBody, DrawerContent, DrawerOverlay, useDisclosure } from "@chakra-ui/core";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isInstalled, isMember, isOwner, shareLink } from "@tennis-score/redux";
import React from "react";
import { LinkContainer } from "react-router-bootstrap";

export function GroupMemberDropdown({
  history,
  user,
  group,
  joinGroup,
  leaveGroup
}) {
  console.log('group', group)
  const joinHandler = _ => {
    if (!user) {
      history.push("/signup");
    } else {
      joinGroup(group.groupId);
    }
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <button
        onClick={onOpen}
        type="button"
        className="btn btn-link btn-sm text-dark"
      >
        <FontAwesomeIcon icon={faEllipsisV} />
      </button>
      <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody className="py-4 pb-5">
            {!isMember(user, group) && (
              <a className="h5 py-2" onClick={joinHandler}>
                Join Group
              </a>
            )}
            {isMember(user, group) && (
              <>
                <LinkContainer to={`/groups/${group.groupId}/newplayer`}>
                  <a className="h5">Add Member</a>
                </LinkContainer>
                <p className="text-muted small pb-2">
                  <em> Invite user or create ghost player</em>
                </p>
              </>
            )}
            {isOwner(user, group) && (
              <LinkContainer to={`/managegroup/${group.groupId}`}>
                <a className="h5 py-2">Manage Group</a>
              </LinkContainer>
            )}
            {isInstalled() && (
                <a
                  className="d-block h5 py-2"
                  onClick={() =>
                    shareLink({
                      title: group.name,
                      text: `Check out ${group.name} leaderboard!`,
                      url: `https://tennisscoresheet.com/leaderboard/${group.groupId}?tab=0`
                    })
                  }
                >
                  Share
                </a>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
