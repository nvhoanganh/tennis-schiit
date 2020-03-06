import { linkBot } from "./sw-shell";
import { realUser } from "./sw-shell-real";
import { checkForBots, getGroupImageUrlFull } from "./utils";
import { getGroup } from "./db";

const express = require("express");
const XRegExp = require("xregexp");
const dynamicRender = express();

const getMeta = async url => {
  // leaderboard - home
  let match = XRegExp.exec(url, XRegExp("/leaderboard/(?<groupId>.+)\\?tab=0"));
  if (match && match.groupId) {
    console.log("match leaderboard home page", match.groupId);
    const group = await getGroup(match.groupId);
    return {
      title: `${group.name} Leaderboard`,
      image: getGroupImageUrlFull(group.groupImage),
      description: `${group.name} Leaderboard - Tennis Score Sheet`,
      content: `${group.name} Leaderboard - Tennis Score Sheet`
    };
  }

  // leaderboard - stats
  match = XRegExp.exec(url, XRegExp("/leaderboard/(?<groupId>.+)\\?tab=1"));
  if (match && match.groupId) {
    console.log("match leaderboard stats");
    const group = await getGroup(match.groupId);
    return {
      title: `${group.name} Player Stats`,
      image: getGroupImageUrlFull(group.groupImage),
      description: `${group.name} Player Stats - Tennis Score Sheet`,
      content: `${group.name} Player Stats - Tennis Score Sheet`
    };
  }

  // player profile
  match = XRegExp.exec(
    url,
    XRegExp(
      "/group/(?<groupId>.+)/player/(?<playerId>.+)\\?userId=(?<userId>.+)"
    )
  );
  if (match) {
    console.log("match player profile");
    const group = await getGroup(match.groupId);
    const player = group.players.find(x => x.userId === match.playerId);
    return {
      title: `${player.name} profile`,
      image: `https://firebasestorage.googleapis.com/v0/b/tennis-schiit.appspot.com/o/images%2Favatar_${match.userId}.png?alt=media`,
      description: `${player.name} Profile - Tennis Score Sheet`,
      content: `${player.name} Profile - Tennis Score Sheet`
    };
  }

  // https://tennisscoresheet.com/headtohead/0oiWTODB7i2iXjCIMw1H/tournament/5UEwlZqwV0aF1OJxfqmb?team1=Zuw8wJhOlMiKg1h9WOgH%7CfC98k2vULrb9HCOpoHts&team2=JUiZ9HOtW1eLsUTvtndZ%7CR0YcF7WNYUQolBtbGDKv
  // head 2 head result
  match = XRegExp.exec(
    url,
    XRegExp(
      "/headtohead/(?<groupId>.+)/tournament/(?<tourId>.+)\\?team1=(?<team1>.+)&team2=(?<team2>.+)"
    )
  );
  if (match) {
    console.log("match head 2 head");
    const group = await getGroup(match.groupId);
    const getPlayers = players =>
      group.players
        .filter(p => players.indexOf(p.userId) >= 0)
        .map(p => p.name)
        .join(",");

    const team1 = getPlayers(match.team1.split("%7C"));
    const team2 = getPlayers(match.team2.split("%7C"));
    return {
      title: `${team1} vs ${team2} - Head 2 Head Result`,
      image: getGroupImageUrlFull(group.groupImage),
      description: `${team1} vs ${team2} - Head 2 Head Result - Tennis Score Sheet`,
      content: `${team1} vs ${team2} - Head 2 Head Result - Tennis Score Sheet`
    };
  }

  // https://tennisscoresheet.com/groups/0oiWTODB7i2iXjCIMw1H/tournament/5UEwlZqwV0aF1OJxfqmb/results
  match = XRegExp.exec(
    url,
    XRegExp("/groups/(?<groupId>.+)/tournament/(?<tourId>.+)/results")
  );
  if (match && match.groupId) {
    console.log("match group result");
    const group = await getGroup(match.groupId);
    return {
      title: `${group.name} latest match results`,
      image: getGroupImageUrlFull(group.groupImage),
      description: `${group.name} latest match results`,
      content: `${group.name} latest match results`
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
dynamicRender.get("*", async (req, res) => {
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
    res.send(linkBot(await getMeta(req.url)));
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
