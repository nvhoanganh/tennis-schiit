/* eslint-disable no-undef */
// https://github.com/justinribeiro/pwa-firebase-functions-botrender/blob/master/functions/index.js
const functions = require("firebase-functions");
const express = require("express");
const app = express();
const linkBot = require("./sw-shell");
const realUser = require("./sw-shell-real");
const XRegExp = require("xregexp");

const checkForBots = userAgent => {
  // These are link bots only! DO NOT ADD GOOGLEBOT. If you add Googlebot to
  // this, you will not have a good day. This is a mix of Sam Li's list
  // (https://github.com/webcomponents/webcomponents.org/blob/696eb6d6f1fe955db395e96d97c3d1dfe0a02b26/client/bot-filter.py#L9)
  // and my list
  // (https://github.com/justinribeiro/blog-pwa/blob/a7174657f3e910cacf2f089c012d40bec719293e/appengine/main.py#L28)
  const botList = "baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkShare|W3C_Validator|slackbot|facebot|web/snippet/|viber".toLowerCase();

  // FIND THE BOT AMONG THE USSSERRRS
  botList.split("|");
  if (userAgent.toLowerCase().search(botList) != -1) {
    return true;
  } else {
    return false;
  }
};

const getMeta = url => {
  // leaderboard
  let match = XRegExp.exec(url, XRegExp("/leaderboard/(?<groupId>.+)?tab=0"));
  if (match && match.groupId) {
    console.log("match leaderboard home page");
    return {
      title: "HSV Leaderboard",
      image:
        "https://firebasestorage.googleapis.com/v0/b/tennis-schiit.appspot.com/o/images%2F0oiWTODB7i2iXjCIMw1H-IMG_20180328_215043_414x260.jpg?alt=media",
      description: "HSV Leaderboard - Tennis Score Sheet",
      content: "HSV Leaderboard - Tennis Score Sheet"
    };
  }

  match = XRegExp.exec(url, XRegExp("/leaderboard/(?<groupId>.+)?tab=1"));
  if (match && match.groupId) {
    console.log("match leaderboard stats");
    return {
      title: "HSV Player Stats",
      image:
        "https://firebasestorage.googleapis.com/v0/b/tennis-schiit.appspot.com/o/images%2F0oiWTODB7i2iXjCIMw1H-IMG_20180328_215043_414x260.jpg?alt=media",
      description: "HSV Group Stats - Tennis Score Sheet",
      content: "HSV Group Stats - Tennis Score Sheet"
    };
  }

  // player profile
  match = XRegExp.exec(
    url,
    XRegExp(
      "/group/(?<groupId>.+)/player/(?<playerId>.+)/?userId=(?<userId>.+)"
    )
  );

  if (match) {
    console.log("match user profile page");
    return {
      title: "Player Profile",
      image: `https://firebasestorage.googleapis.com/v0/b/tennis-schiit.appspot.com/o/images%2Favatar_${match.userId}_200x200.png?alt=media`,
      description: "Player Profile - Tennis Score Sheet",
      content: "Player Profile - Tennis Score Sheet"
    };
  }

  console.log("not matching anything");
  return {
    title: "Tennis Score Sheet",
    image: "https://tennisscoresheet.com/assets/icons/icon-384x384.png",
    description:
      "Create social tennis groups, invite friends, keep track of score, stay competitive, stay connected",
    content:
      "Create social tennis groups, invite friends, keep track of score, stay competitive, stay connected"
  };
};
// This WILL NOT run for index.html because Exact-match static content is before
// configured rewrites (see "Hosting Priorities"
// https://firebase.google.com/docs/hosting/url-redirects-rewrites)
//
// The trick is on L66, pwaShell(): You must update that file! Open for
// explainer.
app.get("*", (req, res) => {
  // What say you bot tester?
  const userAgent = req.headers["user-agent"];
  const botResult = checkForBots(userAgent);
  if (botResult) {
    console.log(
      `Link bot detected for - UserAgent: ${userAgent} -> ${req.url}`
    );
    // get the URL information
    // inject the header
    res.set("Cache-Control", "public, max-age=300, s-maxage=600");
    res.set("Vary", "User-Agent");
    res.send(linkBot(getMeta(req.url)));
  } else {
    // this is real
    console.log(
      `RealUser detected for - UserAgent: ${userAgent} -> ${req.url}`
    );
    // this is the static index.html, we can cache this for long time
    res.set("Cache-Control", "public, max-age=86400, s-maxage=86400");
    res.send(realUser());
  }
});

exports.app = functions.https.onRequest(app);
