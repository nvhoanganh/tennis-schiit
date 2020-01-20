import { roundOff, toChartDate } from "@tennis-score/redux";
import ReactEcharts from "echarts-for-react";
import React from "react";
import * as R from "ramda";

export function PlayerStatsChart({ stats }) {
  const chartOption = () => ({
    grid: {
      left: "3%",
      right: "4%",
      top: "10%",
      containLabel: true
    },
    legend: {},
    xAxis: {
      type: "time",
      splitLine: {
        show: true
      }
    },
    tooltip: {
      trigger: "axis"
    },
    yAxis: {
      type: "value"
    },
    series: getDataSeries()
  });

  const getDataSeries = () => {
    const getSummary = v =>
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

    const getScore = v => ({
      name: v,
      type: "line",
      showSymbol: true,
      hoverAnimation: true,
      data: getSummary(v)
    });

    const d = [
      getScore("score"),
      getScore("prizeMoney"),
      getScore("winPercentage")
    ];
    return d;
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
