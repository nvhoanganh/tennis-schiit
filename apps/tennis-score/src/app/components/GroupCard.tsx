import { GroupMembership } from "./GroupMembership";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import React from "react";
import Card from "react-bootstrap/Card";
import { LinkContainer } from "react-router-bootstrap";
import GroupScoreCard from "./GroupScoreCard";

const GroupCard = ({ index, group, user, showIsMember }) => {
  return (
    <LinkContainer to={`/leaderboard/${group.groupId}`}>
      <Card className="mt-1" body>
        <div className="row px-2">
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
                Created{" "}
                {formatDistanceToNow(group.createdOn.toDate(), {
                  addSuffix: true
                })}
              </em>
            </div>
            <GroupScoreCard group={group} user={user}></GroupScoreCard>
          </div>
        </div>
      </Card>
    </LinkContainer>
  );
};

export default GroupCard;
