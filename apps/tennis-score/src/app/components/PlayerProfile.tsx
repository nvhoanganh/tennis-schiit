import {
  faAtom,
  faClipboardCheck,
  faDollarSign,
  faPercentage
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { hashCode } from "@tennis-score/redux";
import ParticlesBg, { TypeProp } from "particles-bg";
import queryString from "query-string";
import React, { useEffect } from "react";
import AnimatedBg from "react-animated-bg";
import HeaderCard from "./Header";
import MyLoadingSkeleton from "./MyLoadingSekeleton";
import MySpinner from "./MySpinner";
import RoundGravatar from "./RoundGravatar";
import RouteNav from "./RouteNav";
import { StatsCard } from "./StatsCard";

const bgHeight = 200;
const types = ["color", "lines", "thick", "circle", "cobweb", "square"];

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
      <div className="text-center">
        <>
          {player ? (
            <RoundGravatar
              uid={player.linkedplayerId}
              email={player.email}
              size={156}
            />
          ) : (
            <MyLoadingSkeleton height={156} circle={true}></MyLoadingSkeleton>
          )}
        </>
      </div>
      <div>
        <div className="row pt-3">
          <div className="col-sm-12 text-center">
            <div>
              <span className="h4">{player.name}</span>
              {player.linkedplayerId ? (
                <p>
                  {player.leftHanded ? "Left-Handed" : "Right-Handed"},{" "}
                  {player.singleHandedBackhand
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

        <HeaderCard>Statistics</HeaderCard>
        <div className="row m-2">
          <div className="col-6 p-2">
            <StatsCard
              cardClass="bg-success text-white"
              icon={<FontAwesomeIcon icon={faAtom} />}
              number={player.score}
              name="Points"
            />
          </div>
          <div className="col-6 p-2">
            <StatsCard
              cardClass="bg-dark text-white"
              icon={<FontAwesomeIcon icon={faClipboardCheck} />}
              number={player.won + player.lost}
              name="Match played"
            />
          </div>
          <div className="col-6 p-2">
            <StatsCard
              cardClass="bg-info text-white"
              icon={<FontAwesomeIcon icon={faPercentage} />}
              number={player.winPercentage}
              name="Win percentage"
            />
          </div>
          <div className="col-6 p-2">
            <StatsCard
              cardClass="bg-warning text-dark"
              icon={<FontAwesomeIcon icon={faDollarSign} />}
              number={"$" + (player.prizeMoney || "0")}
              name="Total prize money"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayerProfile;
