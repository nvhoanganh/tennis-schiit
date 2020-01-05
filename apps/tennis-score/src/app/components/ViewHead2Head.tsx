import { SearchScore, roundOff, getHandyCap } from "@tennis-score/redux";
import React, { useEffect, useRef, useState } from "react";
import * as R from "ramda";
import HeaderCard from "./Header";
import UpdateButton from "./LoadingButton";
import { PlayerPicker } from "./PlayerPicker";
import ResultCard from "./ResultCard";
import RouteNav from "./RouteNav";
import ReactEcharts from "echarts-for-react";
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

  const team1 = "Team 1";
  const team2 = "Team 2";
  const team1Color = { color: "#45A6C1" };
  const team2Color = { color: "#F7F2B9" };
  const team1TxtColor = { color: "#fff" };
  const team2TxtColor = { color: "#1f2d3d" };
  const divRef = useRef<any>();

  const chartOption = categories => ({
    title: {
      text: "Winning %",
      left: "center"
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    legend: {
      top: "bottom",
      data: ["Team 1", "Team 2"]
    },
    grid: {
      left: "2%",
      top: "5%",
      right: "5%",
      bottom: "5%",
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
    Object.values(scores).forEach(x => {
      const r = x as any;
      if (R.equals(r.winners, state.winners)) {
        stats = R.assocPath(
          ["overall", "team1Win"],
          (R.path(["overall", "team1Win"], stats) || 0) + 1,
          stats
        );
        if (r.headStart) {
          stats = R.assocPath(
            [r.headStart, "team1Win"],
            (R.path([r.headStart, "team1Win"], stats) || 0) + 1,
            stats
          );
        }
      }
      if (R.equals(r.winners, state.losers)) {
        stats = R.assocPath(
          ["overall", "team2Win"],
          (R.path(["overall", "team2Win"], stats) || 0) + 1,
          stats
        );
        if (r.headStart) {
          stats = R.assocPath(
            [r.headStart, "team2Win"],
            (R.path([r.headStart, "team2Win"], stats) || 0) + 1,
            stats
          );
        }
      }
    });
    console.log(stats);
    const toreturnP1 = [];
    const toreturnP2 = [];
    Object.keys(stats).map(k => {
      let total = 0;
      Object.keys(stats[k]).forEach(t => {
        total = total + stats[k][t];
      });

      toreturnP1.push(
        stats[k]["team1Win"]
          ? roundOff((stats[k]["team1Win"] / total) * 100)
          : 0
      );
      toreturnP2.push(
        stats[k]["team2Win"]
          ? roundOff((stats[k]["team2Win"] / total) * 100)
          : 0
      );
    });

    return {
      series: [
        {
          name: team1,
          type: "bar",
          stack: "f",
          label: {
            show: true,
            formatter: "{c}%",
            position: "insideLeft"
          },
          data: toreturnP1
        },
        {
          name: team2,
          type: "bar",
          stack: "f",
          label: {
            show: true,
            formatter: "{c}%",
            position: "insideRight"
          },
          data: toreturnP2
        }
      ],
      categories: Object.keys(stats)
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
              <HeaderCard>Head 2 Head Stats</HeaderCard>
              <div ref={divRef} style={{ float: "left", clear: "both" }}></div>
              <div className="mt-5">
                <ReactEcharts option={getOption()} style={{ height: 350 }} />
              </div>
              <HeaderCard>Previous Results</HeaderCard>
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
