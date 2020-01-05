import React from "react";
import * as R from "ramda";
import ReactEcharts from "echarts-for-react";
import {
  getPlayersNameAsString,
  roundOff,
  getHandyCap
} from "@tennis-score/redux";

export function Head2HeadChart({ scores, winners, losers, players }) {
  const chartOption = categories => ({
    title: {
      show: false
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    legend: {
      top: "top",
      data: [
        getPlayersNameAsString(winners, players),
        getPlayersNameAsString(losers, players)
      ]
    },
    grid: {
      left: "2%",
      top: "10%",
      right: "5%",
      bottom: "0%",
      containLabel: true
    },
    xAxis: {
      type: "value",
      max: 100
    },
    yAxis: {
      type: "category",
      data: categories
    }
  });
  const getDataSeries = scores => {
    let stats = {};
    const team1 = "team1Win";
    const team2 = "team2Win";
    // summarise data
    Object.values(scores).forEach(x => {
      const r = x as any;
      if (R.equals(r.winners, winners)) {
        stats = R.assocPath(
          ["overall", team1],
          (R.path(["overall", team1], stats) || 0) + 1,
          stats
        );
        stats = R.assocPath(
          [r.headStart || "0", team1],
          (R.path([r.headStart || "0", team1], stats) || 0) + 1,
          stats
        );
      } else if (R.equals(r.winners, losers)) {
        stats = R.assocPath(
          ["overall", team2],
          (R.path(["overall", team2], stats) || 0) + 1,
          stats
        );
        // need to invert the headstart value in this case
        stats = R.assocPath(
          [+r.headStart * -1 || "0", team2],
          (R.path([+r.headStart * -1 || "", team2], stats) || 0) + 1,
          stats
        );
      }
    });
    let cats = {};
    Object.keys(stats).map(k => {
      let total = 0;
      Object.keys(stats[k]).forEach(t => {
        total = total + stats[k][t];
      });
      cats[k] = {
        total,
        team1Win: stats[k][team1]
          ? roundOff((stats[k][team1] / total) * 100)
          : 0,
        team2Win: stats[k][team2]
          ? roundOff((stats[k][team2] / total) * 100)
          : 0
      };
    });
    // sort Y-Axis
    const sortedCat = Object.keys(cats).sort();
    return {
      series: [
        {
          name: getPlayersNameAsString(winners, players),
          type: "bar",
          stack: "f",
          label: {
            show: true,
            formatter: "{a}:{c}%",
            position: "insideLeft"
          },
          data: sortedCat.map(x => cats[x][team1])
        },
        {
          name: getPlayersNameAsString(losers, players),
          type: "bar",
          stack: "f",
          label: {
            show: true,
            formatter: "{a}:{c}%",
            position: "insideRight"
          },
          data: sortedCat.map(x => cats[x][team2])
        }
      ],
      categories: sortedCat.map(
        k => `${k != "overall" ? getHandyCap(k) : "overall"} [${cats[k].total}]`
      )
    };
  };

  const getOption = () => {
    const { series, categories } = getDataSeries(scores);
    return {
      ...chartOption(categories),
      series
    };
  };
  return (
    <ReactEcharts
      option={getOption()}
      style={{
        height: 350
      }}
    />
  );
}
