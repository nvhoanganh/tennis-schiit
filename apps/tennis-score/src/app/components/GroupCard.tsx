import React from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import Card from "react-bootstrap/Card";
import { LinkContainer } from "react-router-bootstrap";
import { Button } from "./Button";
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
          <div className="text-muted">
            Created{" "}
            {formatDistanceToNow(group.createdOn.toDate(), {
              addSuffix: false
            })}
          </div>
          <GroupScoreCard
            group={group}
            fontSize=""
            user={user}
          ></GroupScoreCard>
        </div>
      </div>
    </Card>
  );
};

export default GroupCard;
