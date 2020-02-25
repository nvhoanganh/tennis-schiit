import { getScoreString } from "./utils";
import webpush from "web-push";
import { db } from "./db";

export function scoresOnCreate(snap, context) {
  const { groupId } = context.params;
  const { winners, losers, gameWonByLostTeam } = snap.data();
  console.log("TCL: scoresOnCreate -> group.data()", snap.data());
  return db
    .collection("groups")
    .doc(groupId)
    .then(group => {
      const { name, players, webPush } = group.data();

      const winnersName = Object.keys(winners)
        .map(x => players.find(p => p.userId === x).name)
        .join(",");
      const losersName = Object.keys(losers)
        .map(x => players.find(p => p.userId === x).name)
        .join(",");

      const data = {
        title: `${winnersName} vs ${losersName} : ${getScoreString(
          gameWonByLostTeam
        )}`,
        tag: `${name}-score`,
        url: `https://tennisscoresheet.com/leaderboard/${groupId}?tab=0`
      };

      console.log("pushing", data);
      const vapidKeys = {
        subject: "mailto:nvhoanganh1909@gmail.com",
        publicKey:
          "BOnQUejk8Yz83B5JtKYl7muwhbKN9EazPrLi_joamVVJWITeQccDpHZp7JDawXi5xaRu7aaPU2WQ-nx8zAsBKSA",
        privateKey: "VqXw-BOvC7SrsJg0DiNHS7r0yIujUh3mhJ4PkvXrMG4"
      };
      webpush.setVapidDetails(
        vapidKeys.subject,
        vapidKeys.publicKey,
        vapidKeys.privateKey
      );

      return Promise.all(
        // send to all active subscriptions in this group
        Object.values(webPush)
          .filter(x => !!x)
          .map((x: any) => {
            const subscription = JSON.parse(x.data);
            return webpush.sendNotification(subscription, data).catch(err => {
              console.log("TCL: scoresOnCreate -> err", err);
              if (err.statusCode === 404 || err.statusCode === 410) {
                console.log(
                  "Subscription has expired or is no longer valid: ",
                  err
                );
              } else {
                throw err;
              }
            });
          })
      );
    });
}
