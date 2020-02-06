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
      <em className="d-block small text-truncate">
        {props.loc && hashedLocation ? (
          <em>{distance(hashedLocation)} km - </em>
        ) : null}
        {location}
      </em>
      {/* <em className="d-block small">
        Created{" "}
        {formatDistanceToNow(createdOn.toDate(), {
          addSuffix: true
        })}
      </em> */}
      {lastMatch && (
        <em className="d-block small">
          Last match: {" "}
          {formatDistanceToNow(lastMatch.toDate())}
        </em>
      )}
    </div>
  );
};

export default GroupScoreCard;
