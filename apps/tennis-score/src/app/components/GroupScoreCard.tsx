import formatDistanceToNow from "date-fns/formatDistanceToNow";
import GeohashDistance from "geohash-distance";
import React from "react";
const GroupScoreCard = ({
  group: { createdOn, location, played, lastMatch, owner, hashedLocation },
  players,
  user,
  ...props
}) => {
  const distance = geoHash =>
    GeohashDistance.inKm(geoHash, props.loc).toFixed(0);
  return (
    <div>
      <em className="d-block text-muted" style={{ fontSize: "0.7rem" }}>
        {props.loc && hashedLocation ? (
          <em className="text-muted" style={{ fontSize: "0.7rem" }}>
            {distance(hashedLocation)} km away - {" "}
          </em>
        ) : null}
        {location}
      </em>
      <em className="d-block text-muted" style={{ fontSize: "0.7rem" }}>
        Created{" "}
        {formatDistanceToNow(createdOn.toDate(), {
          addSuffix: true
        })}
      </em>
      {lastMatch && (
        <em className="d-block text-muted" style={{ fontSize: "0.7rem" }}>
          Last match:{" "}
          {formatDistanceToNow(lastMatch.toDate(), { addSuffix: true })}
        </em>
      )}
    </div>
  );
};

export default GroupScoreCard;
