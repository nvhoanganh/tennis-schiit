import geohash from "ngeohash";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { LinkContainer } from "react-router-bootstrap";
import { Button } from "./Button";
import GroupCard from "./GroupCard";

const Home = ({ user, groups, myGroups, loading, ...props }) => {
  const getUserLoc = () => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        setLoc(geohash.encode(latitude, longitude));
        console.log("Your current position is:", loc);
      },
      err => {
        console.warn(
          `Cant get user location, ERROR(${err.code}): ${err.message}`
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };
  const [loc, setLoc] = useState(null);
  useEffect(() => {
    getUserLoc();
    props.loadGroups();
  }, []);

  if (loading)
    return (
      <>
        <div className="shadow-sm p-2 mt-3 bg-white border-top border-bottom">
          <Skeleton />
        </div>
        <div className="px-2 py-3">
          {[1, 2, 3, 4].map((p, i) => (
            <GroupCard
              key={p}
              group={null}
              user={null}
              showIsMember={true}
              loading={true}
              loc={loc}
            ></GroupCard>
          ))}
        </div>
      </>
    );

  return (
    <>
      {myGroups.length > 0 && (
        <>
          <div className="shadow-sm p-2 mt-3 bg-white border-top border-bottom">
            My groups
          </div>
          <div className="px-2">
            {myGroups.map((p, i) => (
              <GroupCard
                key={p.groupId}
                group={p}
                user={user}
                loc={loc}
                showIsMember={false}
              ></GroupCard>
            ))}
          </div>
        </>
      )}

      {groups.length > 0 && (
        <>
          <div className="shadow-sm p-2 mt-3 bg-white border-top border-bottom">
            Discover Groups
          </div>
          <div className="px-2">
            {groups.map((p, i) => (
              <GroupCard
                key={p.groupId}
                group={p}
                loc={loc}
                user={user}
                showIsMember={true}
              ></GroupCard>
            ))}
          </div>
        </>
      )}
      <div className="text-center p-3">
        <LinkContainer to={`/newgroup`}>
          <Button
            type="submit"
            className="btn btn-primary btn-sm btn-block btn-sm"
          >
            Create Group
          </Button>
        </LinkContainer>
      </div>
    </>
  );
};

export default Home;
