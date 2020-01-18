import ReactEcharts from "echarts-for-react";
import * as R from "ramda";
import React from "react";
import { format } from "date-fns";
import { roundOff } from "@tennis-score/redux";

export function TournamentStatsChart({ players, stats, title, value }) {
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
      type: "category",
      boundaryGap: false,
      data: timestamps()
    },
    tooltip: {
      trigger: "axis"
    },
    yAxis: {
      type: "value"
    },
    series: getDataSeries()
  });

  const timestamps = () => {
    const d = R.sortBy(
      u => u,
      Object.keys(
        R.groupBy(p => format(p.timestamp.toDate(), "dd/MM"), stats)
      )
    );
    console.log(d);
    return d;
  };
  const getDataSeries = () => {
    const userScores = R.groupBy(p => p.playerId, stats);
    const result = Object.keys(userScores).map(k => ({
      name: players[k].name,
      type: "line",
      showSymbol: true,
      hoverAnimation: true,
      data: Object.values(
        R.groupBy(
          u => u.date,
          R.sortBy(u => u.timestamp, userScores[k]).map(u => ({
            val: roundOff(u[value]) || 0,
            date: format(u.timestamp.toDate(), "dd/MM")
          }))
        )
      ).map(u => u[0].val)
    }));
    console.log(result);
    return result;
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
