import {
  Avatar,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from "@chakra-ui/core";
import {
  faAtom,
  faClipboardCheck,
  faDollarSign,
  faPercentage
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getStatsByPlayer, getUrlAvatar } from "@tennis-score/redux";
import queryString from "query-string";
import React, { useEffect, useState } from "react";
import useLocation from "../hooks/useLocation";
import GroupCard from "./GroupCard";
import HeaderCard from "./Header";
import MyLoadingSkeleton from "./MyLoadingSekeleton";
import MySpinner from "./MySpinner";
import { PlayerStatsChart } from "./PlayerStatsChart";
import RouteNav from "./RouteNav";
import { ScrollPills } from "./ScrollPills";
import { StatsCard } from "./StatsCard";
import PlayerSettings from "./PlayerSettings";

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
  const [myStats, setMyStats] = useState<any>(null);
  const loc = useLocation();
  const q = queryString.parse(location.search);
  useEffect(() => {
    props.loadLeaderboard(match.params.group);
    props.getPlayer(match.params.id, q.userId);
  }, []);
  useEffect(() => {
    if (group && player) {
      getStatsByPlayer({
        groupId: group.groupId,
        tourId: group.currentTournament,
        playerId: player.playerId
      }).then(x => {
        setMyStats(x);
      });
    }
  }, [group, player]);

  if (!player || pendingRequests || (player && !player.name))
    return <MySpinner />;

  return (
    <>
      <RouteNav history={history} center="Player Profile"></RouteNav>
      <div className="d-flex">
        <>
          {player ? (
            <Avatar
              size="2xl"
              name={player.name}
              className="m-auto"
              src={getUrlAvatar(player.linkedplayerId || player.id)}
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
              <>
                <PlayerSettings user={player}></PlayerSettings>
              </>
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
        <div className="m-2 mx-3">
          <Tabs variant="soft-rounded" variantColor="facebook" size="sm">
            <TabList>
              <Tab>Overall</Tab>
              <Tab>Chart</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <div className="row m-2">
                  <div className="col-6 p-2">
                    <StatsCard
                      cardClass="bg-success text-white"
                      icon={<FontAwesomeIcon className="h5" icon={faAtom} />}
                      number={player.score || "0"}
                      name="Points"
                    />
                  </div>
                  <div className="col-6 p-2">
                    <StatsCard
                      cardClass="bg-dark text-white"
                      icon={
                        <FontAwesomeIcon
                          className="h5"
                          icon={faClipboardCheck}
                        />
                      }
                      number={(player.won || 0) + (player.lost || 0)}
                      name="Matches"
                    />
                  </div>
                  <div className="col-6 p-2">
                    <StatsCard
                      cardClass="bg-info text-white"
                      icon={
                        <FontAwesomeIcon className="h5" icon={faPercentage} />
                      }
                      number={player.winPercentage || "0"}
                      name="Win Pct."
                    />
                  </div>
                  <div className="col-6 p-2">
                    <StatsCard
                      cardClass="bg-warning text-dark"
                      icon={
                        <FontAwesomeIcon className="h5" icon={faDollarSign} />
                      }
                      number={player.prizeMoney || "0"}
                      name="Prize money"
                    />
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                {myStats && (
                  <div className="m-2">
                    <PlayerStatsChart stats={myStats}></PlayerStatsChart>
                  </div>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </>

      {player.groups ? (
        <>
          <HeaderCard>Groups</HeaderCard>
          <div className="pb-5">
            <ScrollPills height={300}>
              {Object.keys(player.groups).map((p, i) => (
                <GroupCard
                  style={{ minWidth: 300 }}
                  key={p}
                  group={groups[p]}
                  loc={loc}
                  user={player}
                  showIsMember={false}
                  hideDetails={true}
                ></GroupCard>
              ))}
            </ScrollPills>
          </div>
        </>
      ) : null}
    </>
  );
};

export default PlayerProfile;
