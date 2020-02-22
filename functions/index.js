/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

const functions = require("firebase-functions");
const app = require("./dynamic-render");
const api = require("./api");
const webpush = require("web-push");

// functions
exports.app = functions.https.onRequest(app);

exports.api = functions.https.onRequest(api);

// update
exports.usersTrigger = functions.firestore
  .document("users/{userId}")
  .onUpdate((change, context) => {
    //users/{userId}
    const { userId } = context.params;
    const after = change.after.data();
    const before = change.before.data();

    if (before.avatarUrl !== after.avatarUrl && after.groups) {
      console.log("avatar changed, updating groups");
      return Promise.all(
        Object.keys(after.groups).map(groupId => {
          const groupRef = db.collection("groups").doc(groupId);
          return groupRef.get().then(d =>
            d.exists
              ? groupRef.update({
                  players: d.data().players.map(x =>
                    x.userId === userId
                      ? {
                          ...x,
                          avatarUrl: after.avatarUrl || ""
                        }
                      : x
                  )
                })
              : Promise.resolve()
          );
        })
      );
    }
    return Promise.resolve();
  });

// when new score is submitted
exports.scoresTrigger = functions.firestore
  .document("groups/{groupId}/tournaments/{tourId}/scores/{scoreId}")
  .onUpdate((snap, context) => {
    const { groupId } = context.params;
    const getScore = gwon =>
      (gwon === "6" || gwon === "5" ? "7" : "6") + ":" + gwon;
    const { winners, losers, gameWonByLostTeam } = snap.data();

    console.log("new score", newScore);
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
          title: `${winnersName} vs ${losersName} : ${getScore(
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
            .map(x => {
              const subscription = JSON.parse(x.data);
              return webpush.sendNotification(subscription, data).catch(err => {
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
  });
