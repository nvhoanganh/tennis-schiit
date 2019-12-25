import formatDistanceToNow from "date-fns/formatDistanceToNow";
import React from "react";
import Card from "react-bootstrap/Card";
import { LinkContainer } from "react-router-bootstrap";
import { GroupMembership } from "./GroupMembership";
import GroupScoreCard from "./GroupScoreCard";
const GroupCard = ({ index, group, user, showIsMember }) => {
  const imgUrl = `https://firebasestorage.googleapis.com/v0/b/tennis-schiit.appspot.com/o/${encodeURIComponent(
    group.groupImage
  )}?alt=media`;
  return (
    <LinkContainer to={`/leaderboard/${group.groupId}`}>
      <div className="mt-2 card">
        <img
          src={imgUrl}
          style={{ height: 200, objectFit: "cover" }}
          className="card-img-top"
        ></img>
        <div className="card-body">
          <div className="row px-2 card-text">
            <div className="mr-auto">
              <a
                style={{
                  paddingLeft: 8
                }}
                className="h5 text-dark pl-0"
              >
                {group.name.toUpperCase()}
              </a>
              <GroupMembership
                user={user}
                group={group}
                showIsMember={showIsMember}
              />
              <div>
                <em className="text-muted" style={{ fontSize: "0.7rem" }}>
                  {group.location}
                  {" - Created "}
                  {formatDistanceToNow(group.createdOn.toDate(), {
                    addSuffix: true
                  })}
                </em>
              </div>
              <GroupScoreCard
                group={group}
                user={user}
                players={Object.values(group.players)}
              ></GroupScoreCard>
            </div>
          </div>
        </div>
      </div>
    </LinkContainer>
  );
};

export default GroupCard;
