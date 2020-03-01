import { getScoreString } from "./utils";
const admin = require("firebase-admin");
export const db = admin.firestore();

export function getTournamentResults(groupId: string, tourId: string) {
  return getGroup(groupId).then(group => {
    return (
      db
        .collection("groups")
        .doc(groupId)
        .collection("tournaments")
        .doc(tourId)
        .collection("scores")
        .orderBy("matchDate", "desc")
        //.limit(10)
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
              groupName: group.name,
              winners: group.players
                .filter(p => Object.keys(winners).indexOf(p.userId) >= 0)
                .map(p => p.name)
                .join(";"),
              losers: group.players
                .filter(p => Object.keys(losers).indexOf(p.userId) >= 0)
                .map(p => p.name)
                .join(";"),
              matchDate: matchDate.toDate(),
              isBagel: reverseBagel || gameWonByLostTeam === 0,
              score: getScoreString(gameWonByLostTeam),
              headStart
            };
          })
        )
    );
  });
}

export function getGroup(groupId) {
  return db
    .collection("groups")
    .doc(groupId)
    .get()
    .then(g => g.data());
}
