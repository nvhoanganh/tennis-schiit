export function getScoreString(gwon: string) {
  return (gwon === "6" || gwon === "5" ? "7" : "6") + ":" + gwon;
}

export const checkForBots = userAgent => {
  // These are link bots only! DO NOT ADD GOOGLEBOT. If you add Googlebot to
  // this, you will not have a good day. This is a mix of Sam Li's list
  // (https://github.com/webcomponents/webcomponents.org/blob/696eb6d6f1fe955db395e96d97c3d1dfe0a02b26/client/bot-filter.py#L9)
  // and my list
  // (https://github.com/justinribeiro/blog-pwa/blob/a7174657f3e910cacf2f089c012d40bec719293e/appengine/main.py#L28)
  const botList = "baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkShare|W3C_Validator|slackbot|facebot|web/snippet/|viber".toLowerCase();

  // FIND THE BOT AMONG THE USSSERRRS
  botList.split("|");
  if (userAgent.toLowerCase().search(botList) !== -1) {
    return true;
  } else {
    return false;
  }
};
