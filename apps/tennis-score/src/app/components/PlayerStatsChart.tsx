import { roundOff, toChartDate } from "@tennis-score/redux";
// chart
import ReactEchartsCore from "echarts-for-react/lib/core";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/line";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/tooltip";
import echarts from "echarts/lib/echarts";
import { pipe, map, groupBy, sortBy, last } from "ramda";
import React from "react";

export function PlayerStatsChart({ stats }) {
  const chartOption = () => ({
    title: {
      left: "center",
      bottom: "bottom",
      text: "My Stats"
    },
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
      pipe(
        // start with stats = an Array of match result
        pipe(
          // group by match date
          groupBy(m => m.timestamp.seconds),
          // for each date, sort by match count ascendant
          map(pipe(sortBy(x => x.played))),
          // get the values array
          Object.values,
          // use Reduce to calculate the win/lost
          map(x => ({
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
        map(x => ({
          name: toChartDate(x.timestamp.seconds).toString(),
          value: [toChartDate(x.timestamp.seconds), x.stats[winOrlost]]
        }))
      )(stats);

    const calcLineChart = v =>
      pipe(
        // group by match date
        groupBy(m => m.timestamp.seconds),
        Object.values,
        // for each date, sort by match count ascendant
        map(pipe(sortBy(x => x.played))),
        // for each date, get the last match only
        map(x => last(x)),
        // get the values from this last match
        map(x => ({
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
    <ReactEchartsCore
      echarts={echarts}
      option={chartOption()}
      style={{
        height: 400
      }}
    />
  );
}
