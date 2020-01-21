import * as R from "ramda";
import addSeconds from "date-fns/addSeconds";
const roundOff = roundOff => Math.floor(roundOff * 100) / 100;
const stats = [
  {
    lastMatch: {
      seconds: 1578474985,
      nanoseconds: 530000000
    },
    lost: 1,
    played: 2,
    playerId: "fC98k2vULrb9HCOpoHts",
    previousScore: 0,
    prizeMoney: 0,
    rank: 1,
    score: 16.85722385551057,
    skill: [26.636368781306405, 3.259714975265279],
    timestamp: {
      seconds: 1578441600,
      nanoseconds: 0
    },
    winPercentage: 50,
    won: 1
  },
  {
    lastMatch: {
      seconds: 1579600433,
      nanoseconds: 103000000
    },
    lost: 3,
    played: 9,
    playerId: "fC98k2vULrb9HCOpoHts",
    previousScore: 19.488857822753587,
    prizeMoney: 15,
    rank: 1,
    score: 20.135944063312788,
    skill: [26.255548233397995, 2.0398680566950693],
    timestamp: {
      seconds: 1579564800,
      nanoseconds: 0
    },
    winPercentage: 66.66,
    won: 6
  },
  {
    lastMatch: {
      seconds: 1578473352,
      nanoseconds: 172000000
    },
    lost: 1,
    played: 1,
    playerId: "fC98k2vULrb9HCOpoHts",
    previousScore: 0,
    prizeMoney: -5,
    rank: 1,
    score: 12.999111744254016,
    skill: [24.336035466872016, 3.778974574206],
    timestamp: {
      seconds: 1578441600,
      nanoseconds: 0
    },
    winPercentage: 0
  },
  {
    lastMatch: {
      seconds: 1578997065,
      nanoseconds: 70000000
    },
    lost: 3,
    played: 7,
    playerId: "fC98k2vULrb9HCOpoHts",
    previousScore: 17.972368627340494,
    prizeMoney: 5,
    rank: 1,
    score: 18.840770160969566,
    skill: [25.543830905038828, 2.2343535813564204],
    timestamp: {
      seconds: 1579564800,
      nanoseconds: 0
    },
    winPercentage: 57.14,
    won: 4
  },
  {
    played: 0,
    playerId: "fC98k2vULrb9HCOpoHts",
    previousScore: 0,
    prizeMoney: 0,
    rank: 2,
    score: 7.312303366415335,
    skill: [21.841518342281528, 4.843071658622065],
    timestamp: {
      seconds: 1578441600,
      nanoseconds: 0
    },
    winPercentage: null
  },
  {
    lastMatch: {
      seconds: 1579603081,
      nanoseconds: 522000000
    },
    lost: 3,
    played: 11,
    playerId: "fC98k2vULrb9HCOpoHts",
    previousScore: 20.556274586935544,
    prizeMoney: 25,
    rank: 1,
    score: 20.979979124499213,
    skill: [26.715905842407874, 1.9119755726362206],
    timestamp: {
      seconds: 1579564800,
      nanoseconds: 0
    },
    winPercentage: 72.72,
    won: 8
  },
  {
    lastMatch: {
      seconds: 1578481917,
      nanoseconds: 129000000
    },
    lost: 1,
    played: 4,
    playerId: "fC98k2vULrb9HCOpoHts",
    previousScore: 18.74288376430172,
    prizeMoney: 10,
    rank: 2,
    score: 18.30952389734455,
    skill: [25.995731460160233, 2.5620691876052275],
    timestamp: {
      seconds: 1578960000,
      nanoseconds: 0
    },
    winPercentage: 75,
    won: 3
  },
  {
    lastMatch: {
      seconds: 1579598083,
      nanoseconds: 403000000
    },
    lost: 3,
    played: 8,
    playerId: "fC98k2vULrb9HCOpoHts",
    previousScore: 18.840770160969566,
    prizeMoney: 10,
    rank: 1,
    score: 19.488857822753587,
    skill: [25.874445528262555, 2.128529235169655],
    timestamp: {
      seconds: 1579564800,
      nanoseconds: 0
    },
    winPercentage: 62.5,
    won: 5
  },
  {
    lastMatch: {
      seconds: 1579603065,
      nanoseconds: 932000000
    },
    lost: 3,
    played: 10,
    playerId: "fC98k2vULrb9HCOpoHts",
    previousScore: 20.135944063312788,
    prizeMoney: 20,
    rank: 1,
    score: 20.556274586935544,
    skill: [26.459901954598376, 1.9678757892209442],
    timestamp: {
      seconds: 1579564800,
      nanoseconds: 0
    },
    winPercentage: 70,
    won: 7
  },
  {
    lastMatch: {
      seconds: 1578992979,
      nanoseconds: 14000000
    },
    lost: 2,
    played: 5,
    playerId: "fC98k2vULrb9HCOpoHts",
    previousScore: 18.30952389734455,
    prizeMoney: 5,
    rank: 2,
    score: 17.972368627340494,
    skill: [25.101329533358196, 2.376320302005901],
    timestamp: {
      seconds: 1578960000,
      nanoseconds: 0
    },
    winPercentage: 60,
    won: 3
  },
  {
    lastMatch: {
      seconds: 1578477341,
      nanoseconds: 384000000
    },
    lost: 1,
    played: 3,
    playerId: "fC98k2vULrb9HCOpoHts",
    previousScore: 0,
    prizeMoney: 5,
    rank: 1,
    score: 18.74288376430172,
    skill: [27.214157076723424, 2.8237577708072346],
    timestamp: {
      seconds: 1578441600,
      nanoseconds: 0
    },
    winPercentage: 66.66,
    won: 2
  }
];

const toChartDate = d => {
  const now = addSeconds(new Date(1970, 1, 1), d);
  return [now.getFullYear(), now.getMonth(), now.getDate()].join("/");
};

const getDataSeries = () => {
  const calcWinLost = (stats, winOrlost) =>
    R.pipe(
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
        })),
        // R.tap(console.log)
      ),
      R.map(x => ({
        name: toChartDate(x.timestamp.seconds).toString(),
        value: [toChartDate(x.timestamp.seconds), x.stats[winOrlost]]
      })),
      // R.tap(console.log)
    )(stats);

  const getWinLostSerie = v => ({
    name: v,
    type: "bar",
    stack: "a",
    label: {
      show: true,
      position: "insideRight"
    },
    data: calcWinLost(stats, v)
  });
  return [getWinLostSerie("win"), getWinLostSerie("lost")];
};

const d2 = getDataSeries();
console.log(d2);
