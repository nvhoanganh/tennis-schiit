/* eslint-disable no-undef */

// The Firebase Admin SDK to access the Firebase Realtime Database.

// Listen for changes in all documents in the 'users' collection

function handleUserChange(change, context) {
  console.log(context.params);
  console.log(change.after.data());
}

module.exports = handleUserChange;
