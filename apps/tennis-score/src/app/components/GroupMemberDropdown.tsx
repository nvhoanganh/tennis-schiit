import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  useDisclosure
} from "@chakra-ui/core";
import { isMember, isOwner } from "@tennis-score/redux";
import React from "react";
import { FaEllipsisV } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { ShareLink } from "./ShareLink";

export function GroupMemberDropdown({
  history,
  user,
  group,
  pushNotificationIsOn,
  joinGroup,
  leaveGroup,
  enablePushNotification
}) {
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
        <FaEllipsisV />
      </button>
      <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody className="py-4 pb-5">
            {!isMember(user, group) && (
              <a className="d-block h5 py-2" onClick={joinHandler}>
                Join Group
              </a>
            )}
            {isMember(user, group) && !isOwner(user, group) && (
              <a
                className="d-block h5 py-2"
                onClick={() => {
                  leaveGroup();
                  onClose();
                }}
              >
                Leave Group
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

            {isMember(user, group) && (
              <>
                <a
                  className="h5"
                  onClick={() => {
                    enablePushNotification();
                    onClose();
                  }}
                >
                  Turn {pushNotificationIsOn ? "Off" : "On"} Push Notification
                </a>
                {pushNotificationIsOn ? (
                  <p className="text-muted small pb-2">
                    <em> Stop receiving push notification for this group</em>
                  </p>
                ) : (
                  <p className="text-muted small pb-2">
                    <em> Get push notification when new score is added</em>
                  </p>
                )}
              </>
            )}
            {isOwner(user, group) && (
              <LinkContainer to={`/managegroup/${group.groupId}`}>
                <a className="d-block h5 py-2">Manage Group</a>
              </LinkContainer>
            )}
            <ShareLink
              title={`${group.name} Results`}
              text={`Check out ${group.name} match results!`}
              url={window.location.href}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
