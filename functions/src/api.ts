import { getTournamentResults, getAllResults } from "./db";
import * as R from "ramda";
const express = require("express");
const api = express();

api.get(
  "/api/groups/:groupId/tournament/:tourId/result.json",
  (req: any, res: any) => {
    const { groupId, tourId } = req.params;
    getTournamentResults(groupId, tourId).then(d => {
      res.set("Content-Type", "application/json");
      res.send(d);
    });
  }
);

api.get("/api/groups/:groupId/tournament/:tourId/result.csv", (req, res) => {
  const { groupId, tourId } = req.params;
  getTournamentResults(groupId, tourId).then(
    d => {
      const csv =
        "winners,winnersId,losers,losersId,matchDate,isBagel,score,headStart\n" +
        d
          .map(
            x =>
              `${x.winners},${x.winnersId},${x.losers},${
                x.losersId
              },${x.matchDate.toISOString()},${x.isBagel},${x.score},${
                x.headStart
              }`
          )
          .join("\n");
      res.set("Content-Type", "text/plain");
      res.send(csv);
    },
    error => {
      res.set("Content-Type", "text/plain");
      res.send("Error:" + error);
    }
  );
});

api.get("/api/results/trainingdata.json", (req, res) => {
  getAllResults().then(
    d => {
      res.set("Content-Type", "application/json");
      res.send(d);
    },
    error => {
      res.set("Content-Type", "text/plain");
      res.send("Error:" + error);
    }
  );
});

api.get("/api/results/trainingdata.csv", (req, res) => {
  getAllResults().then(
    d => {
      const csv =
        "groupName,groupId,team1,team1Name,team2,team2Name,matchDate,isBagel,score,headStart,WinOrLose\n" +
        // split in half
        R.take(d.length / 2, d)
          .map(
            x =>
              `${x.groupName},${x.groupIdx},${x.winnersId},${x.winners},${
                x.losersId
              },${x.losers},${x.matchDate.toISOString()},${x.isBagel},${
                x.score
              },${x.headStart || 0},1`
          )
          .join("\n") +
        "\n" +
        R.takeLast(d.length / 2, d)
          .map(
            x =>
              `${x.groupName},${x.groupIdx},${x.losersId},${x.losers},${
                x.winnersId
              },${x.winners},${x.matchDate.toISOString()},${x.isBagel},${
                x.score
              },${x.headStart || 0},0`
          )
          .join("\n");
      res.set("Content-Type", "text/plain");
      res.send(csv);
    },
    error => {
      res.set("Content-Type", "text/plain");
      res.send("Error:" + error);
    }
  );
});

api.get(
  "/api/groups/:groupId/tournament/:tourId/trainingdata.csv",
  (req, res) => {
    const { groupId, tourId } = req.params;
    getTournamentResults(groupId, tourId).then(
      d => {
        const csv =
          "team1,team1Name,team2,team2Name,matchDate,isBagel,score,headStart,WinOrLose\n" +
          // split in half
          R.take(d.length / 2, d)
            .map(
              x =>
                `${x.winnersId},${x.winners},${x.losersId},${
                  x.losers
                },${x.matchDate.toISOString()},${x.isBagel},${
                  x.score
                },${x.headStart || 0},1`
            )
            .join("\n") +
          "\n" +
          R.takeLast(d.length / 2, d)
            .map(
              x =>
                `${x.losersId},${x.losers},${x.winnersId},${
                  x.winners
                },${x.matchDate.toISOString()},${x.isBagel},${
                  x.score
                },${x.headStart || 0},0`
            )
            .join("\n");
        res.set("Content-Type", "text/plain");
        res.send(csv);
      },
      error => {
        res.set("Content-Type", "text/plain");
        res.send("Error:" + error);
      }
    );
  }
);

export default api;
