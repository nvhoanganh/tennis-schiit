import formatDistanceToNow from "date-fns/formatDistanceToNow";
import GeohashDistance from "geohash-distance";
import React from "react";
const GroupScoreCard = ({
  group: { location, lastMatch, hashedLocation },
  players,
  user,
  ...props
}) => {
  const distance = geoHash =>
    GeohashDistance.inKm(geoHash, props.loc).toFixed(0);
  return (
    <div>
      <span className="d-block small text-truncate">
        {props.loc && hashedLocation ? (
          <span>{distance(hashedLocation)} km - </span>
        ) : null}
        {location}
      </span>
      {/* <em className="d-block small">
        Created{" "}
        {formatDistanceToNow(createdOn.toDate(), {
          addSuffix: true
        })}
      </em> */}
      {lastMatch && (
        <span className="d-block small">
          Last match: {formatDistanceToNow(lastMatch.toDate())}
        </span>
      )}
    </div>
  );
};

export default GroupScoreCard;
