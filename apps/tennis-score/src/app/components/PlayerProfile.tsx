import {
  faAtom,
  faClipboardCheck,
  faDollarSign,
  faPercentage
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import queryString from "query-string";
import React, { useEffect } from "react";
import HeaderCard from "./Header";
import MyLoadingSkeleton from "./MyLoadingSekeleton";
import MySpinner from "./MySpinner";
import RoundGravatar from "./RoundGravatar";
import RouteNav from "./RouteNav";
import { StatsCard } from "./StatsCard";
import GroupCard from "./GroupCard";
import useLocation from "../hooks/useLocation";

const PlayerProfile = ({
  player,
  match,
  group,
  groups,
  history,
  pendingRequests,
  tournament,
  location,
  ...props
}) => {
  const loc = useLocation();
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
      <div className="d-flex">
        <>
          {player ? (
            <RoundGravatar
              uid={player.linkedplayerId}
              email={player.email}
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
      <>
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
              number={(player.won || 0) + (player.lost || 0)}
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
      </>

      {player.groups ? (
        <>
          <HeaderCard>Groups</HeaderCard>
          <div className="row m-2">
            {Object.keys(player.groups).map((p, i) => (
              <div key={p} className="col-6 p-2">
                <GroupCard
                  group={groups[p]}
                  loc={loc}
                  user={player}
                  showIsMember={false}
                  hideDetails={true}
                ></GroupCard>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </>
  );
};

export default PlayerProfile;
