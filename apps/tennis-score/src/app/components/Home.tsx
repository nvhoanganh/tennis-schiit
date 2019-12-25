import { faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect } from "react";
import FloatButton from "./FloatButton";
import GroupCard from "./GroupCard";
const Home = ({ user, groups, myGroups, ...props }) => {
  useEffect(() => {
  props.loadGroups();
  }, []);

  return (
    <>
      {user && (
        <FloatButton icon={faPlus} tooltip="Add new score" url={`/newgroup`} />
      )}
      {myGroups.length > 0 && (
        <>
          <h4 className="text-center pt-3">My Groups</h4>
          <div className="px-2 pb-5">
            {myGroups.map((p, i) => (
              <GroupCard
                index={i}
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
          <h4 className="text-center pt-3">Groups near me</h4>
          <div className="px-2 pb-5">
            {groups.map((p, i) => (
              <GroupCard
                index={i}
                key={p.groupId}
                group={p}
                user={user}
                showIsMember={true}
              ></GroupCard>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
