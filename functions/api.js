/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const express = require("express");
const api = express();
const admin = require("firebase-admin");
const db = admin.firestore();
function getScoreString(gwon) {
  return (gwon === "6" || gwon === "5" ? "7" : "6") + ":" + gwon;
}
function getData(groupId, tourId) {
  return db
    .collection("groups")
    .doc(groupId)
    .collection("tournaments")
    .doc(tourId)
    .collection("scores")
    .orderBy("matchDate", "desc")
    .get()
    .then(d =>
      d.docs.map(x => {
        const {
          winners,
          losers,
          matchDate,
          reverseBagel,
          headStart,
          gameWonByLostTeam
        } = x.data();
        return {
          winners: Object.keys(winners).join(";"),
          losers: Object.keys(losers).join(";"),
          matchDate: matchDate.toDate(),
          isBagel: reverseBagel || gameWonByLostTeam === 0,
          score: getScoreString(gameWonByLostTeam),
          headStart
        };
      })
    );
}
api.get("/api/groups/:groupId/tournament/:tourId/result.json", (req, res) => {
  const { groupId, tourId } = req.params;
  getData(groupId, tourId).then(d => {
    res.set("Content-Type", "application/json");
    res.send(d);
  });
});

api.get("/api/groups/:groupId/tournament/:tourId/result.csv", (req, res) => {
  const { groupId, tourId } = req.params;
  getData(groupId, tourId).then(d => {
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
  });
});

module.exports = api;
