/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const functions = require("firebase-functions");
const app = require("./dynamic-render");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// functions
exports.app = functions.https.onRequest(app);

// update
exports.usersTrigger = functions.firestore
  .document("users/{userId}")
  .onUpdate((change, context) => {
    //users/{userId}
    const { userId } = context.params;
    const { avatarUrl, groups } = change.after.data();
    console.log(avatarUrl);
    return Promise.resolve();
  });
