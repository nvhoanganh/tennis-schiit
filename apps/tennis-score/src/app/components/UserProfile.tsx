import React, { useEffect, useState } from "react";
import { Button } from "./Button";
import Gravatar from "react-gravatar";
import { ScoreCard } from "./ScoreCard";
const UserProfile = ({ signOutHandler, history, user, ...props }) => {
  const [signedOut, setSignedOut] = useState(false);
  useEffect(() => {
    if (!user && !signedOut) {
      history.push("/signin");
    } else if (signedOut && !user) {
      history.push("/home");
    }
  }, [user]);

  function signOutNow() {
    setSignedOut(true);
    signOutHandler();
  }
  return (
    <div className="container-fluid">
      <div className="row pt-3">
        <div className="col-sm-12 text-center">
          {user && user.user ? (
            <Gravatar email={user.user.email} size={150} />
          ) : null}
        </div>
      </div>
      <div className="row pt-3">
        <div className="col-sm-12 text-center">
          <div>
            <h2>Nicole Pearson</h2>
            <p>
              <strong>Right-handed, One-Handed Backhand</strong>
            </p>
            <div className="text-center">
              <ScoreCard
                fontSize="l"
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
            <strong>$30.00</strong>
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
    </div>
  );
};

export default UserProfile;
