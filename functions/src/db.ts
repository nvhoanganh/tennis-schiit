import { getScoreString } from "./utils";
const admin = require("firebase-admin");
export const db = admin.firestore();
import * as R from "ramda";

export function getTournamentResults(groupId: string, tourId: string) {
  return getGroup(groupId).then(group => {
    console.log(group);
    return (
      db
        .collection("groups")
        .doc(groupId)
        .collection("tournaments")
        .doc(tourId)
        .collection("scores")
        .orderBy("matchDate", "desc")
        // .limit(10)
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
              groupId: groupId,
              groupName: group.name,
              winnersIds: Object.keys(winners).join(";"),
              winners: group.players
                .filter(p => Object.keys(winners).indexOf(p.userId) >= 0)
                .map(p => p.name)
                .join(";"),
              losersIds: Object.keys(losers).join(";"),
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
        .then(results => {
          // get normalized winners and losers
          const getWL = lw =>
            R.pipe(
              R.map(R.prop(lw)),
              R.flatten
            );

          const getUniqSortedPlayers = R.pipe(
            R.converge(R.concat, [getWL("winnersIds"), getWL("losersIds")]),
            R.uniq,
            a => a.sort()
          );

          const uniqueSorted = getUniqSortedPlayers(results);

          return results.map(r => ({
            ...r,
            winnersId: uniqueSorted.indexOf(r.winnersIds),
            losersId: uniqueSorted.indexOf(r.losersIds)
          }));
        })
    );
  });
}

export function getAllResults() {
  return getAllGroups()
    .then(groups =>
      Promise.all(
        groups
          .filter(x => !x.deletedDate && !!x.currentTournament)
          .map(x => getTournamentResults(x.groupId, x.currentTournament))
      )
    )
    .then(R.flatten)
    .then(results => {
      const sortedGroupIds = R.pipe(
        R.map(R.prop("groupId")),
        R.uniq,
        a => a.sort()
      )(results);

      return results
        .map(r => ({
          ...r,
          groupIdx: sortedGroupIds.indexOf(r.groupId)
        }))
        .map(r => ({
          ...r,
          winnersId: r.winnersId + r.groupIdx * 1000,
          losersId: r.losersId + r.groupIdx * 1000
        }));
    });
}

export function getGroup(groupId) {
  return db
    .collection("groups")
    .doc(groupId)
    .get()
    .then(g => g.data());
}

export function getAllGroups() {
  return db
    .collection("groups")
    .get()
    .then(x => x.docs.map(y => ({ ...y.data(), groupId: y.id })));
}
