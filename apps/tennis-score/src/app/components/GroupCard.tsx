import { GroupMembership } from "./GroupMembership";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import React from "react";
import Card from "react-bootstrap/Card";
import { LinkContainer } from "react-router-bootstrap";
import GroupScoreCard from "./GroupScoreCard";

const GroupCard = ({ index, group, user }) => {
  return (
    <Card className="mt-1" body>
      <div className="row">
        <div className="mr-auto">
          <LinkContainer to={`/leaderboard/${group.groupId}`}>
            <a
              style={{
                paddingLeft: 8
              }}
              className="h3 pl-0"
            >
              {group.name.toUpperCase()}
            </a>
          </LinkContainer>
          <GroupMembership user={user} group={group} />
          <div>
            <em className="text-muted" style={{ fontSize: "0.7rem" }}>
              Created{" "}
              {formatDistanceToNow(group.createdOn.toDate(), {
                addSuffix: false
              })}
            </em>
          </div>
          <GroupScoreCard group={group} user={user}></GroupScoreCard>
        </div>
      </div>
    </Card>
  );
};

export default GroupCard;
