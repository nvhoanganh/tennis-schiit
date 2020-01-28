import { faHandshake, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Skeleton from "react-loading-skeleton";
import Img from "react-image";
import { LinkContainer } from "react-router-bootstrap";
import { GroupMembership } from "./GroupMembership";
import GroupScoreCard from "./GroupScoreCard";
import { getGroupImageUrl } from "@tennis-score/redux";
import MyLoadingSkeleton from "./MyLoadingSekeleton";
import styled from "@emotion/styled";

const cardHeight = 260;
const Module = styled.div`
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6)),
    url(${(p: any) => p.imageUrl});
  height: ${cardHeight}px;
  position: relative;
  overflow: hidden;
  margin: 11px;
  border-radius: 15px;
  background-repeat: no-repeat;
  background-size: cover;
`;

const Header = styled.header`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px 10px;
`;

const Content = styled.div`
  margin: 0;
  color: white;
  text-shadow: 0 1px 0 black;
`;

const GroupCard = ({ group, user, showIsMember, ...props }) => {
  const loading = props.loading;

  return (
    <LinkContainer
      style={{ ...props.style }}
      to={loading ? "" : `/leaderboard/${group ? group.groupId : ""}`}
    >
      {loading ? (
        <MyLoadingSkeleton height={cardHeight} class="card-img-top border-bottom" />
      ) : (
        <Module
          className="shadow-lg border"
          imageUrl={getGroupImageUrl(group.groupImage)}
        >
          <Header>
            <Content>
              <div className="d-flex mt-3">
                <div className="flex-grow-1">
                  <a>{group.name.toUpperCase()}</a>
                  <GroupMembership
                    user={user}
                    group={group}
                    showIsMember={showIsMember}
                  />
                </div>
                <div className="text-nowrap">
                  {Object.values(group.players).length}
                  <FontAwesomeIcon className="pl-1" icon={faUsers} />{" "}
                  {group.played}
                  <FontAwesomeIcon className="pl-1" icon={faHandshake} />
                </div>
              </div>
              {!props.hideDetails ? (
                <GroupScoreCard
                  group={group}
                  loc={props.loc}
                  user={user}
                  players={Object.values(group.players)}
                ></GroupScoreCard>
              ) : null}
            </Content>
          </Header>
        </Module>
      )}
    </LinkContainer>
  );
};

export default GroupCard;
