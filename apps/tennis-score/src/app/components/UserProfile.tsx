import { Avatar, Link } from "@chakra-ui/core";
import { getUrlAvatar } from "@tennis-score/redux";
import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import useLocation from "../hooks/useLocation";
import GroupCard from "./GroupCard";
import HeaderCard from "./Header";
import UpdateButton from "./LoadingButton";
import MyLoadingSkeleton from "./MyLoadingSekeleton";
import PlayerSettings from "./PlayerSettings";
import RouteNav from "./RouteNav";
import { ScrollPills } from "./ScrollPills";

const StatusIcon = styled.div`
  font-size: 0.8em;
  border-radius: 50%;
  border: solid 1px blue;
`;

const UserProfile = ({
  signOutHandler,
  history,
  user,
  player,
  loading,
  myGroups,
  ...props
}) => {
  const loc = useLocation();
  useEffect(() => {
    props.loadGroups();
  }, []);
  console.log(player);
  return !user ? (
    <Redirect to="/signin" />
  ) : (
    <div>
      <RouteNav history={history} center="User Profile"></RouteNav>
      <div className="d-flex pb-4">
        <>
          {user ? (
            <Avatar
              size="2xl"
              name={user.displayName}
              className="m-auto"
              src={getUrlAvatar(user.uid)}
            />
          ) : (
            <MyLoadingSkeleton
              height={156}
              width={156}
              style={{ margin: "auto" }}
              circle={true}
            ></MyLoadingSkeleton>
          )}
        </>
      </div>
      <PlayerSettings user={user} />
      {myGroups ? (
        <>
          <HeaderCard>Groups</HeaderCard>
          <div>
            <ScrollPills height={300}>
              {Object.keys(myGroups).map((p, i) => (
                <GroupCard
                  style={{ minWidth: 300 }}
                  key={p}
                  group={myGroups[p]}
                  loc={loc}
                  user={user}
                  showIsMember={false}
                  hideDetails={true}
                ></GroupCard>
              ))}
            </ScrollPills>
          </div>
        </>
      ) : null}

      <div className="row pt-5 px-2 text-center">
        <div className="col-12 emphasis">
          <div className="btn-group dropup btn-block">
            <UpdateButton
              loading={loading}
              onClick={signOutHandler}
              value="Sign Out"
              type="button"
              className="btn btn-primary btn-sm btn-block"
            ></UpdateButton>
          </div>
        </div>
      </div>
      <div className="row pt-2 pb-5 px-2">
        <div className="col-12 text-center">
          <LinkContainer to="/account-details/edit">
            <Link title="Update Details" href="">
              Update Details
            </Link>
          </LinkContainer>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
