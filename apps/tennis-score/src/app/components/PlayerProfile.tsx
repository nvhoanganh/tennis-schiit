import React, { useEffect } from "react";
import Gravatar from "react-gravatar";
import { maxContainer } from "./common";
import RouteNav from "./RouteNav";
import { roundOff } from "@tennis-score/redux";
import MySpinner from "./MySpinner";
import UpdateButton from "./LoadingButton";
import { Button } from "./Button";
const PlayerProfile = ({
  player,
  user,
  match,
  group,
  history,
  pendingRequests,
  tournament,
  ...props
}) => {
  useEffect(() => {
    props.loadGroups();
    props.loadLeaderboard(match.params.group);
    props.getUser(match.params.id);
  }, []);

  if (!player || pendingRequests) return <MySpinner />;
  console.log("player is", player);
  return (
    <>
      <RouteNav history={history} center="Player Profile"></RouteNav>
      <div {...maxContainer}>
        <div className="row pt-3">
          <div className="col-sm-12 text-center">
            {player ? <Gravatar email={player.email} size={150} /> : null}
          </div>
        </div>
        <div className="row pt-3">
          <div className="col-sm-12 text-center">
            <div>
              <h2>{player.name}</h2>
              {player.linkedplayerId ? (
                <p>
                  <strong>
                    {player.leftHanded ? "Left-Handed" : "Right-Handed"},{" "}
                    {player.singleHandedBackhand
                      ? "One-Handed Backhand"
                      : "Two-Handed Backhand"}
                  </strong>
                </p>
              ) : (
                <div className="col-12">
                  <em>Ghost Player</em>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="row pt-4 text-center">
          <div className="col-xs-12 col-sm-4 text-center">
            <figure>
              <figcaption className="ratings">
                <h5>True Skill Point</h5>
              </figcaption>
            </figure>
          </div>
          <div className="col-xs-12 col-sm-4 emphasis">
            <h2>
              <strong>{roundOff(player.score || 0)}</strong>
            </h2>
          </div>
        </div>
        <div className="row text-center">
          <div className="col-xs-12 col-sm-4 text-center">
            <figure>
              <figcaption className="ratings">
                <h5>Win/Lost</h5>
              </figcaption>
            </figure>
          </div>
          <div className="col-xs-12 col-sm-4 emphasis">
            <h2>
              <strong>
                {player.won || "0"}-{player.lost || "0"}
              </strong>
            </h2>
          </div>
        </div>
        <div className="row text-center">
          <div className="col-xs-12 col-sm-4 text-center">
            <figure>
              <figcaption className="ratings">
                <h5>Prize Money</h5>
              </figcaption>
            </figure>
          </div>
          <div className="col-xs-12 col-sm-4 emphasis">
            <h2>
              <strong>${player.prizeMoney || "0"}</strong>
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayerProfile;
