import React from "react";
import Gravatar from "react-gravatar";
import { LinkContainer } from "react-router-bootstrap";
import { Redirect } from "react-router-dom";
import { Link } from "./Link";
import UpdateButton from "./LoadingButton";
import { maxContainer } from "./common";
import RouteNav from "./RouteNav";
const PlayerProfile = ({ signOutHandler, user, loading, history }) => {
  return !user ? (
    <Redirect to="/signin" />
  ) : (
    <>
      <RouteNav history={history} center="Player Profile"></RouteNav>
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
        <div className="row pt-4 text-center">
          <div className="col-xs-12 col-sm-4 text-center">
            <figure>
              <figcaption className="ratings">
                <h5>Total Prize Money</h5>
              </figcaption>
            </figure>
          </div>
          <div className="col-xs-12 col-sm-4 emphasis">
            <h2>
              <strong>$40.00</strong>
            </h2>
          </div>
        </div>
        <div className="row text-center">
          <div className="col-xs-12 col-sm-4 text-center">
            <figure>
              <figcaption className="ratings">
                <h5>Perentage Win</h5>
              </figcaption>
            </figure>
          </div>
          <div className="col-xs-12 col-sm-4 emphasis">
            <h2>
              <strong>40.99%</strong>
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayerProfile;