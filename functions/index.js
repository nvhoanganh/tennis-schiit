/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const handleUserChange = require("./firestore-trigged");
const functions = require("firebase-functions");
const app = require("./dynamic-render");
const admin = require("firebase-admin");

admin.initializeApp();

// functions
exports.app = functions.https.onRequest(app);

exports.usersTrigger = functions.firestore
  .document("users/{userId}")
  .onWrite(handleUserChange);
