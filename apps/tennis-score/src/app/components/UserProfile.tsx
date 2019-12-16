import React, { useEffect, useState } from "react";
import Gravatar from "react-gravatar";
import { LinkContainer } from "react-router-bootstrap";
import { Button } from "./Button";
import { Link } from "./Link";
import { ScoreCard } from "./ScoreCard";
import useAuthGuard from '../hooks/useAuthGuard';

const UserProfile = ({ signOutHandler, history, user, appLoaded }) => {
  useAuthGuard({ user, appLoaded, history });
  function signOutNow() {
    signOutHandler().then(_ => {
      history.push("/home");
    });
  }
  if (!user) return null;
  return (
    <div className="container-fluid">
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
            <div className="text-center">
              <ScoreCard
                fontSize="1rem"
                played={4}
                won={3}
                lost={1}
                bagelWin={0}
                bagelLost={1}
              />
            </div>
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
      <div className="row pt-5 text-center">
        <div className="col-xs-12 col-sm-4 emphasis">
          <div className="btn-group dropup btn-block">
            <Button
              onClick={signOutNow}
              type="button"
              className="btn btn-primary"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
      <div className="row pt-3">
        <div className="col-md-6 text-center">
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
