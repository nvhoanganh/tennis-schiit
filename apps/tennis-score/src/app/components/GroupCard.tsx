import { faHandshake, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Skeleton from "react-loading-skeleton";
import { LinkContainer } from "react-router-bootstrap";
import { GroupMembership } from "./GroupMembership";
import GroupScoreCard from "./GroupScoreCard";
import { getGroupImageUrl } from '@tennis-score/redux';

const GroupCard = ({ group, user, showIsMember, ...props }) => {
  const loading = props.loading;

  return (
    <LinkContainer
      style={{ borderRadius: 13 }}
      to={loading ? "" : `/leaderboard/${group ? group.groupId : ""}`}
    >
      <div className="card shadow my-2">
        {loading ? (
          <>
            <Skeleton height={140} />
            <Skeleton height={80} />
          </>
        ) : (
          <>
            <img
              src={getGroupImageUrl(group.groupImage)}
              style={{
                height: 140,
                objectFit: "cover",
                borderRadius: "13px 13px 0px 0px"
              }}
              className="card-img-top border"
            ></img>
            <div className="card-body pt-0 pb-3">
              <div className="d-flex mt-3">
                <div className="flex-grow-1">
                  <a className="text-dark">{group.name.toUpperCase()}</a>
                  <GroupMembership
                    user={user}
                    group={group}
                    showIsMember={showIsMember}
                  />
                </div>
                <div className="text-nowrap">
                  {Object.values(group.players).length}
                  <FontAwesomeIcon
                    className="pl-1 text-muted"
                    icon={faUsers}
                  />{" "}
                  {group.played}
                  <FontAwesomeIcon
                    className="pl-1 text-muted"
                    icon={faHandshake}
                  />
                </div>
              </div>

              <GroupScoreCard
                group={group}
                loc={props.loc}
                user={user}
                players={Object.values(group.players)}
              ></GroupScoreCard>
            </div>
          </>
        )}
      </div>
    </LinkContainer>
  );
};

export default GroupCard;
