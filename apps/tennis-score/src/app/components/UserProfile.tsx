import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import useLocation from "../hooks/useLocation";
import GroupCard from "./GroupCard";
import HeaderCard from "./Header";
import MyLoadingSkeleton from "./MyLoadingSekeleton";
import RoundGravatar from "./RoundGravatar";
import RouteNav from "./RouteNav";
import UpdateButton from "./LoadingButton";
import { Link } from '@chakra-ui/core';
const UserProfile = ({
  signOutHandler,
  history,
  user,
  loading,
  groups,
  ...props
}) => {
  const loc = useLocation();
  useEffect(() => {
    console.log("user groups", user.groups);
    console.log("all groups", groups);
  }, []);
  return !user ? (
    <Redirect to="/signin" />
  ) : (
    <div>
      <RouteNav history={history} center="User Profile"></RouteNav>
      <div className="d-flex">
        <>
          {user ? (
            <RoundGravatar
              uid={user.uid}
              email={user.email}
              size={156}
              style={{ margin: "auto" }}
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

      <div className="row pt-3">
        <div className="col-sm-12 text-center">
          <div>
            <span className="h4">{user.displayName}</span>
            {user.uid ? (
              <p>
                {user.leftHanded ? "Left-Handed" : "Right-Handed"},{" "}
                {user.singleHandedBackhand
                  ? "One-Handed Backhand"
                  : "Two-Handed Backhand"}
              </p>
            ) : (
              <div className="col-12">
                <em>Ghost Player</em>
              </div>
            )}
          </div>
        </div>
      </div>

      {user.groups ? (
        <>
          <HeaderCard>My Groups</HeaderCard>
          <div className="row m-2">
            {Object.keys(user.groups).map((p, i) => (
              <div key={p} className="col-6 p-2">
                <GroupCard
                  group={groups[p]}
                  loc={loc}
                  user={user}
                  showIsMember={false}
                  hideDetails={true}
                ></GroupCard>
              </div>
            ))}
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
      <div className="row pt-2 px-2">
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
