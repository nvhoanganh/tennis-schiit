import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/core";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { LinkContainer } from "react-router-bootstrap";
import useLocation from "../hooks/useLocation";
import { Button } from "./Button";
import GroupCard from "./GroupCard";

const Home = ({ user, groups, myGroups, loading, ...props }) => {
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
      <Tabs isFitted>
        <TabList>
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
                  showIsMember={false}
                ></GroupCard>
              ))}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>

      <div className="text-center p-2">
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
