import React, { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { LinkContainer } from "react-router-bootstrap";
import { Button } from "./Button";
import GroupCard from "./GroupCard";

const Home = ({ user, groups, myGroups, loading, ...props }) => {
  useEffect(() => {
    props.loadGroups();
  }, []);

  if (loading)
    return (
      <>
        <div className="shadow-sm p-2 mt-3 bg-white border-top border-bottom">
          <Skeleton />
        </div>
        <div className="px-2">
          {[1, 2, 3, 4].map((p, i) => (
            <GroupCard
              key={p}
              group={null}
              user={null}
              showIsMember={true}
              loading={true}
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
                showIsMember={false}
              ></GroupCard>
            ))}
          </div>
        </>
      )}

      {groups.length > 0 && (
        <>
          <div className="shadow-sm p-2 mt-3 bg-white border-top border-bottom">
            Groups near me
          </div>
          <div className="px-2">
            {groups.map((p, i) => (
              <GroupCard
                key={p.groupId}
                group={p}
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
