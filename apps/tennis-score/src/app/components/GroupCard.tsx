import styled from "@emotion/styled";
import { getGroupImageUrl } from "@tennis-score/redux";
import React from "react";
import { FaHandshake, FaUser } from "react-icons/fa";
import Ripples from "react-ripples";
import { GroupMembership } from "./GroupMembership";
import GroupScoreCard from "./GroupScoreCard";
import MyLoadingSkeleton from "./MyLoadingSekeleton";

const Header = styled.header`
  width: 100%;
  padding: 0px 15px 15px 15px;
`;

const IconRows = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  padding: 20px 10px 6px;
  color: white;
  margin: 0px;
  text-alight: right;
`;

const Content = styled.div`
  margin: 0;
`;

const GroupCard = ({ group, user, showIsMember, history, ...props }) => {
  const loading = props.loading;
  const Module = styled.div`
    background: url(${(p: any) => p.imageUrl});
    height: ${props.height || 260}px;
    position: relative;
    overflow: hidden;
    background-repeat: no-repeat;
    background-size: cover;
  `;
  return (
    <div style={{ ...props.style }} className="border-top">
      <Ripples
        className="w-100 group__link"
        onClick={() =>
          setTimeout(
            () => history.push(`/leaderboard/${group ? group.groupId : ""}`),
            200
          )
        }
      >
        {loading || !group ? (
          <MyLoadingSkeleton
            height={props.height || 260}
            class="card-img-top border-bottom"
          />
        ) : (
          <div className="w-100">
            <Module
              className="shadow-sm"
              imageUrl={getGroupImageUrl(group.groupImage)}
            >
              <IconRows>
                <div className="text-nowrap text-right">
                  <span
                    className="rounded-lg p-1 small"
                    style={{
                      backgroundColor: "rgb(52,58,64, 0.6)"
                    }}
                  >
                    {Object.values(group.players).length}
                    <FaUser className="pl-1 d-inline small" /> {group.played}
                    <FaHandshake className="pl-1 d-inline small" />
                  </span>
                </div>
              </IconRows>
            </Module>
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
          </div>
        )}
      </Ripples>
    </div>
  );
};

export default GroupCard;
