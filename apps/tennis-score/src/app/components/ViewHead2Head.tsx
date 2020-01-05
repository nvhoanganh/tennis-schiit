import {
  getPlayersName,
  roundOff,
  SearchScore,
  getHandyCap
} from "@tennis-score/redux";
import ReactEcharts from "echarts-for-react";
import * as R from "ramda";
import React, { useEffect, useRef, useState } from "react";
import HeaderCard from "./Header";
import UpdateButton from "./LoadingButton";
import { PlayerPicker } from "./PlayerPicker";
import ResultCard from "./ResultCard";
import RouteNav from "./RouteNav";
const getPlayers = (p, allP) => (
  <span>{getPlayersName(p, allP).join("/")}</span>
);
const getPlayersNameAsString = (p, allP) => getPlayersName(p, allP).join("/");
const ViewHead2Head = ({
  pendingRequests,
  group,
  players,
  playersAsObject,
  match,
  submitScore,
  history,
  ...props
}) => {
  useEffect(() => {
    props.loadLeaderboard(match.params.group);
  }, []);

  const initState = {
    winners: {},
    losers: {},
    formValid: false
  };
  const [state, setState] = useState(initState);
  const [scores, setScores] = useState({});
  const [searched, setSearched] = useState(false);

  const divRef = useRef<any>();

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
        getPlayersNameAsString(state.winners, playersAsObject),
        getPlayersNameAsString(state.losers, playersAsObject)
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
      if (R.equals(r.winners, state.winners)) {
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
      } else if (R.equals(r.winners, state.losers)) {
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
          name: getPlayersNameAsString(state.winners, playersAsObject),
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
          name: getPlayersNameAsString(state.losers, playersAsObject),
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

  const validateAndSubmit = e => {
    e.preventDefault();
    SearchScore({
      groupId: match.params.group,
      tourId: match.params.tour,
      ...state
    }).then(result => {
      setSearched(true);
      setScores(result);
      divRef.current.scrollIntoView({ behavior: "smooth" });
    });
  };

  useEffect(() => {
    setState(current => {
      return {
        ...current,
        formValid:
          Object.keys(state.winners).length > 0 &&
          Object.keys(state.winners).length <= 2 &&
          Object.keys(state.losers).length > 0 &&
          Object.keys(state.losers).length <= 2 &&
          Object.keys(state.losers).length === Object.keys(state.winners).length
      };
    });
  }, [state.winners, state.losers]);
  return (
    <>
      {group ? (
        <>
          <RouteNav
            history={history}
            center="View Head 2 Head Results"
          ></RouteNav>
          <div className="pb-3 px-2">
            <form noValidate onSubmit={validateAndSubmit}>
              <div className="mt-3">
                <PlayerPicker
                  players={players}
                  state={state}
                  setValue={setState}
                  winnerText="Team 1"
                  loserText="Team 2"
                />
              </div>

              <div className="text-center pt-3 py-2">
                <UpdateButton
                  loading={pendingRequests}
                  loadingText="Saving..."
                  value="View H2H Results"
                  type="submit"
                  disabled={!state.formValid || pendingRequests > 0}
                  className="btn btn-primary btn-sm btn-block"
                ></UpdateButton>
              </div>
            </form>
          </div>
          {Object.keys(scores).length ? (
            <>
              <div ref={divRef} style={{ float: "left", clear: "both" }}></div>
              <HeaderCard>
                {getPlayers(state.winners, playersAsObject)} vs.{" "}
                {getPlayers(state.losers, playersAsObject)}
              </HeaderCard>
              <div className="mt-5">
                <ReactEcharts option={getOption()} style={{ height: 350 }} />
              </div>
              <HeaderCard>Results</HeaderCard>
              <div>
                {Object.keys(scores).map(k => (
                  <ResultCard
                    key={k}
                    players={playersAsObject}
                    {...scores[k]}
                  ></ResultCard>
                ))}
              </div>
            </>
          ) : searched ? (
            <div className="text-center pb-3 px-2 text-muted small">
              <em>No Result Found</em>
            </div>
          ) : null}
        </>
      ) : null}
    </>
  );
};

export default ViewHead2Head;
