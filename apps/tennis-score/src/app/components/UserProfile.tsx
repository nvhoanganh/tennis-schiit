import React from "react";
import Gravatar from "react-gravatar";
import { LinkContainer } from "react-router-bootstrap";
import { Redirect } from "react-router-dom";
import { Link } from "./Link";
import UpdateButton from "./LoadingButton";
import { maxContainer } from './common';
const UserProfile = ({ signOutHandler, user, loading }) => {
  return !user ? (
    <Redirect to="/signin" />
  ) : (
    <div {...maxContainer}>
      <div className="row pt-3">
        <div className="col-sm-12 text-center">
          {user ? <Gravatar email={user.email} size={150} /> : null}
        </div>
      </div>
      <div className="row pt-3">
        <div className="col-sm-12 text-center">
          <div>
            <h2>{user.displayName}</h2>
            <p>
              <strong>
                {user.leftHanded ? "Left-Handed" : "Right-Handed"},{" "}
                {user.singleHandedBackhand
                  ? "One-Handed Backhand"
                  : "Two-Handed Backhand"}
              </strong>
            </p>
          </div>
        </div>
      </div>
      <div className="row pt-5 text-center">
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
      <div className="row pt-3">
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
