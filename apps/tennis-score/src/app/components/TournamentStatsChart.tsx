import { roundOff, toChartDate } from "@tennis-score/redux";
// chart
import ReactEchartsCore from "echarts-for-react/lib/core";
import "echarts/lib/chart/line";
import "echarts/lib/component/title";
import "echarts/lib/component/tooltip";
import echarts from "echarts/lib/echarts";

import * as R from "ramda";
import React from "react";



function TournamentStatsChart({
  players,
  stats,
  title,
  value,
  prefix,
  suffix
}) {
  const chartOption = () => ({
    title: {
      left: "center",
      bottom: "bottom",
      text: title
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
        show: true
      }
    },
    tooltip: {
      trigger: "axis",
      formatter: function(params) {
        const getLabel = R.pipe(
          R.sort((x, y) => y.data.value[1] - x.data.value[1]),
          R.map(x => `${x.seriesName} : ${prefix}${x.data.value[1]}${suffix}`)
        );
        return `<strong>${params[0].data.name}</strong>:<br><br>${getLabel(
          params
        ).join("<br>")}`;
      },
      axisPointer: {
        animation: false
      }
    },
    yAxis: {
      type: "value"
    },
    series: getDataSeries()
  });

  const getDataSeries = () => {
    const userScores = R.groupBy(p => p.playerId, stats);

    const getPlayerArray = o =>
      // get Array from object
      Object.keys(o).map(k => ({
        playerId: k,
        matches: o[k].map(v => ({
          playerId: k,
          ...v
        }))
      }));

    const result = R.pipe(
      getPlayerArray,
      R.map(k => ({
        name: players[k.playerId] ? players[k.playerId].name : "NA",
        playerId: k.playerId,
        type: "line",
        showSymbol: true,
        hoverAnimation: true,
        data: R.pipe(
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
            value: [toChartDate(x.timestamp.seconds), roundOff(x[value])]
          }))
        )(k.matches)
      }))
    )(userScores);
    return result;
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
export default TournamentStatsChart;
