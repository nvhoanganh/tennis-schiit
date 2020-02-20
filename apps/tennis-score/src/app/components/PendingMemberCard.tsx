import { Avatar } from "@chakra-ui/core";
import { getUrlAvatar } from "@tennis-score/redux";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { Button } from "./Button";

const PendingMemberCard = ({ player, ...props }) => {
  return (
    <div className="col-sm-6 col-md-4 col-lg-3 border-bottom border-top shadow-sm">
      <div className="card-body px-0 py-3">
        <div className="float-left pr-3 pl-0">
          <LinkContainer to={player ? `/player/${player.uid}` : ""}>
            <Avatar
              size="sm"
              name={player.displayName}
              className="m-auto"
              src={player.avatarUrl ? getUrlAvatar(player.uid) : ""}
            />
          </LinkContainer>
        </div>
        <div className="mr-auto">
          <LinkContainer to={player ? `/player/${player.uid}` : ""}>
            <a className="h6 text-dark pl-0">{player.displayName}</a>
          </LinkContainer>
          <div className="float-right text-right">
            <Button
              type="button"
              onClick={() => props.approveJoinRequest(player)}
              className="btn btn-primary btn-sm"
            >
              <FaCheckCircle />
            </Button>
            <Button
              type="button"
              onClick={() => props.rejectJoinRequest(player)}
              className="btn ml-1 btn-danger btn-sm"
            >
              <FaTimesCircle />
            </Button>
          </div>
          <div>
            <em className="d-block text-muted x-small">
              {formatDistanceToNow(player.requestDate.toDate())}
            </em>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingMemberCard;
