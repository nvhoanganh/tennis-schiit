import { faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect } from "react";
import FloatButton from "./FloatButton";
import GroupCard from "./GroupCard";
const Home = ({ user, groups, players, ...props }) => {
  useEffect(() => {
    props.loadGroups();
  }, []);

  // return <pre>{JSON.stringify(groups, null, 2)}</pre>;
  return (
    <>
      <h4 className="text-center pt-3">Groups</h4>
      <FloatButton icon={faPlus} tooltip="Add new score" url={`/newgroup`} />

      <div className="px-1 pb-5">
        {groups.map((p, i) => (
          <GroupCard
            index={i}
            key={p.groupId}
            group={p}
            user={user}
          ></GroupCard>
        ))}
      </div>
    </>
  );
};

export default Home;
