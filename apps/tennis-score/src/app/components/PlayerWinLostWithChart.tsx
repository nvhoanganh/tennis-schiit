// chart
import ReactEchartsCore from "echarts-for-react/lib/core";
import "echarts/lib/chart/pie";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/tooltip";
import echarts from "echarts/lib/echarts";

import React from "react";

export function PlayerWinLostWithChart({ stats, players, playerId }) {
  const chartOption = () => ({
    title: {
      left: "center",
      bottom: -5,
      text: "Win/Lost Records"
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} {b}: {c} ({d}%)"
    },
    series: getDataSeries()
  });

  const getOtherPlayer = (o, me) => Object.keys(o).filter(x => x !== me)[0];

  const winLostRecords = stats.reduce((pre, cur) => {
    if (!pre) {
      if (cur.winners[playerId]) {
        // I won
        return {
          winWith: {
            [getOtherPlayer(cur.winners, playerId)]: 1
          }
        };
      }
      if (cur.losers[playerId]) {
        // I won
        return {
          lostWith: {
            [getOtherPlayer(cur.losers, playerId)]: 1
          }
        };
      }
    } else {
      if (cur.winners[playerId]) {
        // I won
        const otherplayer = getOtherPlayer(cur.winners, playerId);
        return {
          ...pre,
          winWith: {
            ...pre.winWith,
            [otherplayer]: (pre.winWith ? pre.winWith[otherplayer] || 0 : 0) + 1
          }
        };
      }
      if (cur.losers[playerId]) {
        const otherplayer = getOtherPlayer(cur.losers, playerId);
        // I won
        return {
          ...pre,
          lostWith: {
            ...pre.lostWith,
            [otherplayer]:
              (pre.lostWith ? pre.lostWith[otherplayer] || 0 : 0) + 1
          }
        };
      }
    }
  }, null);
  const getDataSeries = () => {
    const getStats = o =>
      Object.keys(o).map(x => ({
        value: o[x],
        name: players[x] ? players[x].name : "NA"
      }));

    return [
      {
        name: "Win with",
        type: "pie",
        radius: ["0%", "60%"],
        label: {
          position: "inkner"
        },
        data: winLostRecords.winWith ? getStats(winLostRecords.winWith) : []
      },
      {
        name: "Lost with",
        type: "pie",
        label: {
          position: "inner"
        },
        radius: ["70%", "87%"],
        data: winLostRecords.lostWith ? getStats(winLostRecords.lostWith) : []
      }
    ];
  };

  return winLostRecords ? (
    <ReactEchartsCore
      echarts={echarts}
      option={chartOption()}
      style={{
        height: 400
      }}
    />
  ) : null;
}
