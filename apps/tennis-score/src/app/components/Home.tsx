import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/core";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import useLocation from "../hooks/useLocation";
import GroupCard from "./GroupCard";

const Home = ({ user, groups, myGroups, loading, history, ...props }) => {
  const loc = useLocation();
  const [tabs, setTabs] = useState<any>({});
  useEffect(() => {
    setTabs(s => {
      return {
        ...s,
        ...(myGroups.length > 0 && {
          groups: {
            groups: myGroups,
            name: "My Groups"
          }
        }),
        ...(groups.length > 0 && {
          discover: {
            groups,
            name: "Discover"
          },
          new: {
            groups: [],
            isNew: true,
            name: "Add Group"
          }
        })
      };
    });
  }, [myGroups, groups]);

  if (loading)
    return (
      <>
        <div className="shadow-sm p-2 bg-white border-top border-bottom">
          <Skeleton />
        </div>
        <div className="px-2 py-3">
          {[1, 2, 3, 4].map((p, i) => (
            <GroupCard
              key={p}
              history={history}
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

  const handleTabsChange = index => {
    if (Object.values(tabs)[index]["isNew"]) {
      history.push("/newgroup");
    }
  };

  return (
    <>
      <Tabs
        variant="soft-rounded"
        variantColor="facebook"
        size="sm"
        onChange={handleTabsChange}
      >
        <TabList className="m-2">
          {Object.keys(tabs).map(k => (
            <Tab key={k}>{tabs[k].name}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {Object.keys(tabs).map(k => (
            <TabPanel key={k}>
              {tabs[k].groups.map((p, i) => (
                <GroupCard
                  key={p.groupId}
                  group={p}
                  user={user}
                  loc={loc}
                  history={history}
                  showIsMember={false}
                ></GroupCard>
              ))}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </>
  );
};

export default Home;
