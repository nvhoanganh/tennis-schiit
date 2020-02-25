import { linkBot } from "./sw-shell";
import { realUser } from "./sw-shell-real";
import XRegExp from "xregexp";
import { checkForBots } from "./utils";

const express = require("express");
const dynamicRender = express();

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
dynamicRender.get("*", (req, res) => {
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

export default dynamicRender;
