import { getScoreString } from "./utils";
const admin = require("firebase-admin");
export const db = admin.firestore();

export function getTournamentResults(groupId: string, tourId: string) {
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
