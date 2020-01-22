import { roundOff, toChartDate } from "@tennis-score/redux";
import ReactEcharts from "echarts-for-react";
import React from "react";
import * as R from "ramda";

export function PlayerStatsChart({ stats }) {
  const chartOption = () => ({
    grid: {
      left: "3%",
      right: "4%",
      top: "20%",
      containLabel: true
    },
    legend: {},
    xAxis: {
      type: "time",
      splitLine: {
        show: false
      }
    },
    tooltip: {
      trigger: "axis"
    },
    yAxis: [
      {
        splitLine: {
          show: false
        },
        type: "value"
      },
      {
        splitLine: {
          show: true
        },
        type: "value"
      }
    ],
    series: getDataSeries()
  });

  const getDataSeries = () => {
    const calcWinLost = (stats, winOrlost) =>
      R.pipe(
        // start with stats = an Array of match result
        R.pipe(
          // group by match date
          R.groupBy(m => m.timestamp.seconds),
          // for each date, sort by match count ascendant
          R.map(R.pipe(R.sortBy(x => x.played))),
          // get the values array
          Object.values,
          // use Reduce to calculate the win/lost
          R.map(x => ({
            timestamp: x[0].timestamp,
            stats: x.reduce((pre, cur) => {
              if (!pre) {
                return {
                  win: cur.previousScore < cur.score ? 1 : 0,
                  lost: cur.previousScore > cur.score ? 1 : 0
                };
              } else {
                return {
                  win: pre.win + (cur.previousScore < cur.score ? 1 : 0),
                  lost: pre.lost + (cur.previousScore > cur.score ? 1 : 0)
                };
              }
            }, null)
          }))
        ),
        R.map(x => ({
          name: toChartDate(x.timestamp.seconds).toString(),
          value: [toChartDate(x.timestamp.seconds), x.stats[winOrlost]]
        }))
      )(stats);

    const calcLineChart = v =>
      R.pipe(
        // group by match date
        R.groupBy(m => m.timestamp.seconds),
        Object.values,
        // for each date, sort by match count ascendant
        R.map(R.pipe(R.sortBy(x => x.played))),
        // for each date, get the last match only
        R.map(x => R.last(x)),
        // get the values from this last match
        R.map(x => ({
          name: toChartDate(x.timestamp.seconds).toString(),
          value: [toChartDate(x.timestamp.seconds), roundOff(x[v])]
        }))
      )(stats);

    const getLineChart = v => ({
      name: v,
      type: "line",
      showSymbol: true,
      hoverAnimation: true,
      data: calcLineChart(v)
    });
    const getWinLostSerie = v => ({
      name: v,
      type: "bar",
      stack: "a",
      barMaxWidth: 30,
      yAxisIndex: 1,
      label: {
        show: true,
        fontSize: 14,
        fontWeight: "bold",
        color: "black"
      },
      itemStyle: {
        barBorderColor: v === "win" ? "#2F855A" : "#C53030",
        color: v === "win" ? "#28a745" : "#FC8181",
        opacity: 0.4
      },
      data: calcWinLost(stats, v)
    });

    return [
      getLineChart("score"),
      getLineChart("prizeMoney"),
      getLineChart("winPercentage"),
      getWinLostSerie("win"),
      getWinLostSerie("lost")
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
