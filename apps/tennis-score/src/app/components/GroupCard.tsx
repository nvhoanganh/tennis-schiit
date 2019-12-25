import formatDistanceToNow from "date-fns/formatDistanceToNow";
import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { GroupMembership } from "./GroupMembership";
import GroupScoreCard from "./GroupScoreCard";
const GroupCard = ({ index, group, user, showIsMember }) => {
  const imgUrl = `https://firebasestorage.googleapis.com/v0/b/tennis-schiit.appspot.com/o/${encodeURIComponent(
    group.groupImage
  )}?alt=media`;
  return (
    <LinkContainer to={`/leaderboard/${group.groupId}`}>
      <div className="col-sm-6 col-md-4 col-lg-3">
        <img
          src={imgUrl}
          style={{ height: 140, objectFit: "cover" }}
          className="card-img-top border"
        ></img>
        <div className="card-body">
          <div className="row card-text">
            <div className="mr-auto">
              <a className="text-nowrap text-dark">{group.name.toUpperCase()}</a>
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
              <em className="d-block text-muted" style={{ fontSize: "0.7rem" }}>
                {group.location}
              </em>
              <em className="d-block text-muted" style={{ fontSize: "0.7rem" }}>
                Created{" "}
                {formatDistanceToNow(group.createdOn.toDate(), {
                  addSuffix: true
                })}
              </em>
            </div>
          </div>
        </div>
      </div>
    </LinkContainer>
  );
};

export default GroupCard;
