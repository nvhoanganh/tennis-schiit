import { db } from "./db";
import * as R from "ramda";
import { getScoreString } from "./utils";
import * as firebase from "firebase-admin";

export function scoresOnCreate(snap, context) {
  const { groupId } = context.params;
  console.log("TCL: scoresOnCreate -> groupId", groupId);
  const { winners, losers, gameWonByLostTeam, reverseBagel } = snap.data();
  console.log("TCL: scoresOnCreate -> group.data()", snap.data());
  return db
    .collection("groups")
    .doc(groupId)
    .get()
    .then(group => {
      const { name, players, webPush } = group.data();
      const winnersName = Object.keys(winners)
        .map(x => players.find(p => p.userId === x).name)
        .join(",");
      const losersName = Object.keys(losers)
        .map(x => players.find(p => p.userId === x).name)
        .join(",");

      const data = {
        title: `New score for '${name}'!`,
        message: `${winnersName} def. ${losersName} : ${getScoreString(
          gameWonByLostTeam
        )}${reverseBagel || gameWonByLostTeam === 0 ? " [Bagel]" : ""}`,
        url: `https://tennisscoresheet.com/leaderboard/${groupId}?tab=0`
      };

      const vapidKeys = {
        subject: "mailto:nvhoanganh1909@gmail.com",
        publicKey:
          "BOnQUejk8Yz83B5JtKYl7muwhbKN9EazPrLi_joamVVJWITeQccDpHZp7JDawXi5xaRu7aaPU2WQ-nx8zAsBKSA",
        privateKey: "VqXw-BOvC7SrsJg0DiNHS7r0yIujUh3mhJ4PkvXrMG4"
      };
      const webpush = require("web-push");
      webpush.setVapidDetails(
        vapidKeys.subject,
        vapidKeys.publicKey,
        vapidKeys.privateKey
      );

      return Promise.all(
        R.flatten(
          Object.keys(webPush)
            .filter(userId => !!webPush[userId])
            .map(userId => {
              return Object.values(webPush[userId]).map((sub: any) => {
                if (!sub) {
                  return Promise.resolve();
                }
                const subscription = JSON.parse(sub.data);

                return webpush
                  .sendNotification(subscription, JSON.stringify(data))
                  .catch(err => {
                    if (err.statusCode === 404 || err.statusCode === 410) {
                      console.log(
                        `Subscription has expired or is no longer valid: ${userId}.${sub.id}. Deleting it now..`
                      );
                      return db
                        .collection("groups")
                        .doc(groupId)
                        .update({
                          [`webPush.${userId}.${sub.id}`]: firebase.firestore.FieldValue.delete()
                        })
                        .then(() => {
                          console.log(
                            `Subscription ${userId}.${sub.id} deleted`
                          );
                        })
                        .catch(e => {
                          console.log(
                            `Failed to delete subscription ${userId}.${sub.id}`
                          );
                        });
                    } else {
                      console.log(`Uknown Eror: ${subscription.endpoint}`, err);
                      return Promise.resolve();
                    }
                  });
              });
            })
        )
      );
    });
}
