const admin = require("firebase-admin");
admin.initializeApp();

import * as functions from "firebase-functions";
import api from "./api";
import dynamicRender from "./dynamic-render";
import { scoresOnCreate } from "./scores.triggers";
import { usersOnUpdate } from "./users.triggers";

// dynamic renderer
exports.app = functions.https.onRequest(dynamicRender);

// export data api
exports.api = functions.https.onRequest(api);

// update
exports.usersTrigger = functions.firestore
  .document("users/{userId}")
  .onUpdate(usersOnUpdate);

// when new score is submitted
exports.scoresTrigger = functions.firestore
  .document("groups/{groupId}/tournaments/{tourId}/scores/{scoreId}")
  .onCreate(scoresOnCreate);
