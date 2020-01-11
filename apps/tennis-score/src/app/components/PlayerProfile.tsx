import { roundOff, hashCode } from "@tennis-score/redux";
import ParticlesBg, { TypeProp } from "particles-bg";
import queryString from "query-string";
import React, { useEffect } from "react";
import { maxContainer } from "./common";
import MySpinner from "./MySpinner";
import RouteNav from "./RouteNav";
import RoundGravatar from "./RoundGravatar";
import Skeleton from "react-loading-skeleton";
import MyLoadingSkeleton from "./MyLoadingSekeleton";
const bgHeight = 200;
const types = [
  "color",
  "ball",
  "lines",
  "thick",
  "circle",
  "cobweb",
  "polygon",
  "square",
  "tadpole",
  "fountain",
  "custom"
];

const getTypeFromName = name =>
  types[hashCode(name) % types.length] as TypeProp;

const bgConfig = {
  num: [4, 7],
  rps: 0.1,
  radius: [5, 40],
  life: [1.5, 3],
  v: [2, 3],
  tha: [-40, 40],
  // body: "./img/icon.png", // Whether to render pictures
  // rotate: [0, 20],
  alpha: [0.6, 0],
  scale: [1, 0.1],
  color: ["random", "#ff0000"],
  cross: "dead", // cross or bround
  random: 15, // or null,
  g: 5, // gravity
  position: { x: 1, y: 1, width: "100%", height: bgHeight }
};

const PlayerProfile = ({
  player,
  match,
  group,
  history,
  pendingRequests,
  tournament,
  location,
  ...props
}) => {
  useEffect(() => {
    props.loadLeaderboard(match.params.group);
    const q = queryString.parse(location.search);
    props.getPlayer(match.params.id, q.userId);
  }, []);

  if (!player || pendingRequests || (player && !player.name))
    return <MySpinner />;
  return (
    <>
      <RouteNav history={history} center="Player Profile"></RouteNav>
      <div
        className="text-center"
        style={{
          height: bgHeight,
          position: "relative",
          top: -13,
          marginBottom: 40
        }}
      >
        <>
          <ParticlesBg type={getTypeFromName(player.name)} config={bgConfig} />
          {player ? (
            <RoundGravatar
              uid={player.linkedplayerId}
              email={player.email}
              size={156}
              style={{
                position: "relative",
                top: -103,
                border: "6px solid white"
              }}
            />
          ) : (
            <MyLoadingSkeleton
              height={156}
              width={156}
              circle={true}
              style={{
                position: "relative",
                top: -103,
                border: "6px solid white"
              }}
            ></MyLoadingSkeleton>
          )}
        </>
      </div>
      <div {...maxContainer}>
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
