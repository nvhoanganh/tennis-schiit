/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

const functions = require("firebase-functions");
const app = require("./dynamic-render");
const api = require("./api");

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
