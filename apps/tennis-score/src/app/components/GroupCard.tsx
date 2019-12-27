import formatDistanceToNow from "date-fns/formatDistanceToNow";
import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { GroupMembership } from "./GroupMembership";
import GroupScoreCard from "./GroupScoreCard";
import {
  faUsers,
  faHandsHelping,
  faHandshake
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const GroupCard = ({ group, user, showIsMember }) => {
  const imgUrl = `https://firebasestorage.googleapis.com/v0/b/tennis-schiit.appspot.com/o/${encodeURIComponent(
    group.groupImage
  )}?alt=media`;
  return (
    <LinkContainer to={`/leaderboard/${group.groupId}`}>
      <div className="py-3 my-2 col-sm-6 col-md-4 col-lg-3 border-top border-bottom shadow-sm bg-white rounded">
        <img
          src={imgUrl}
          style={{
            height: 140,
            objectFit: "cover"
          }}
          className="card-img-top border"
        ></img>
        <div className="card-body">
          <div className="row card-text">
            <div className="mr-auto">
              <a className="text-nowrap text-dark">
                {group.name.toUpperCase()}
              </a>
              <GroupMembership
                user={user}
                group={group}
                showIsMember={showIsMember}
              />
              <GroupScoreCard
                group={group}
                user={user}
                players={Object.values(group.players)}
              ></GroupScoreCard>
            </div>

            <div className="float-right text-right">
              {Object.values(group.players).length}
              <FontAwesomeIcon
                className="pl-1 text-muted"
                icon={faUsers}
              />{" "}
              {group.played}
              <FontAwesomeIcon className="pl-1 text-muted" icon={faHandshake} />
            </div>
          </div>
        </div>
      </div>
    </LinkContainer>
  );
};

export default GroupCard;
