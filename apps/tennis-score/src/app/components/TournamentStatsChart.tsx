import ReactEcharts from "echarts-for-react";
import * as R from "ramda";
import React from "react";
import { format } from "date-fns";

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
      boundaryGap: false
      // data: timestamps()
    },
    yAxis: {
      type: "value"
    },
    series: getDataSeries()
  });

  const timestamps = () => {
    return Object.keys(
      R.groupBy(p => format(p.timestamp.toDate(), "dd/MM/yyyy"), stats)
    );
  };
  const getDataSeries = () => {
    const userScores = R.groupBy(p => p.playerId, stats);
    const result = Object.keys(userScores).map(k => ({
      name: players[k].name,
      type: "line",
      showSymbol: true,
      hoverAnimation: true,
      data: R.sortBy(u => u.timestamp.toDate(), userScores[k]).map(
        u => u[value] || 0
      )
    }));
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
