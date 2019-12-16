import React from "react";
import Card from "react-bootstrap/Card";
import { LinkContainer } from "react-router-bootstrap";
import { Button } from "./Button";
import GroupScoreCard from "./GroupScoreCard";

const GroupCard = ({ index, group, user }) => {
  return (
    <Card className="mt-1" body>
      <div className="row">
        <div className="mx-2"></div>
        <div className="mr-auto">
          <LinkContainer to={`/leaderboard/${group.name}`}>
            <Button
              disabled={false}
              type="button"
              style={{ paddingLeft: 8, fontSize: "1.8rem" }}
              className="btn btn-lg btn-link pl-0"
            >
              {index + 1} - {group.name}
            </Button>
          </LinkContainer>
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
