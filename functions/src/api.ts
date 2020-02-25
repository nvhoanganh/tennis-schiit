import { getTournamentResults } from "./db";
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
        "winners,losers,matchDate,isBagel,score,headStart\n" +
        d
          .map(
            x =>
              `${x.winners},${x.losers},${x.matchDate.toISOString()},${
                x.isBagel
              },${x.score},${x.headStart}`
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

export default api;
