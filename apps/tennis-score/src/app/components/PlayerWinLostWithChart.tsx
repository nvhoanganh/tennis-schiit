import ReactEcharts from "echarts-for-react";
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

  const getDataSeries = () => {
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
              [otherplayer]:
                (pre.winWith ? pre.winWith[otherplayer] || 0 : 0) + 1
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

    const getStats = o =>
      Object.keys(o).map(x => ({
        value: o[x],
        name: players[x].name
      }));

    console.log(players);
    return [
      {
        name: "Win with",
        type: "pie",
        radius: ["0%", "60%"],
        label: {
          position: "inner"
        },
        data: getStats(winLostRecords.winWith)
      },
      {
        name: "Lost with",
        type: "pie",
        label: {
          position: "inner"
        },
        radius: ["70%", "87%"],
        data: getStats(winLostRecords.lostWith)
      }
    ];
  };

  return (
    <ReactEcharts
      option={chartOption()}
      style={{
        height: 400
      }}
    />
  );
}
