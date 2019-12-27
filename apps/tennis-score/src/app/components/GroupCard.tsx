import { faHandshake, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { GroupMembership } from "./GroupMembership";
import GroupScoreCard from "./GroupScoreCard";
import Skeleton from "react-loading-skeleton";
const GroupCard = ({ group, user, showIsMember, ...props }) => {
  const loading = props.loading;
  const imgUrl = `https://firebasestorage.googleapis.com/v0/b/tennis-schiit.appspot.com/o/${encodeURIComponent(
    loading ? "" : group.groupImage
  )}?alt=media`;
  return (
    <LinkContainer to={loading ? "" : `/leaderboard/${group.groupId}`}>
      <div className="py-3 my-2 col-sm-6 col-md-4 col-lg-3 border-top border-bottom shadow-sm bg-white rounded">
        {loading ? (
          <>
            <Skeleton height={140} />
            <Skeleton height={80} />
          </>
        ) : (
          <>
            <img
              src={imgUrl}
              style={{
                height: 140,
                objectFit: "cover"
              }}
              className="card-img-top border"
            ></img>
            <div>
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
