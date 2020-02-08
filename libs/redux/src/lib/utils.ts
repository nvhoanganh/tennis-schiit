import * as R from "ramda";
import addSeconds from "date-fns/addSeconds";

export function delay(duration): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}
export const arrayToObject = (array: any[], keymap, valuemap) => {
  return array.reduce(
    (presV, currV) => ({
      ...presV,
      [keymap(currV)]: valuemap(currV)
    }),
    {}
  );
};

export const isOwner = (user, group) =>
  user && group && group.owner === user.uid;

export const isMember = (user, group) =>
  user &&
  group &&
  group.players &&
  Object.values(group.players).filter(x => x["linkedplayerId"] === user.uid)
    .length > 0;

export const removeById = (id, obj) => {
  const { [id]: removed, ...newState } = obj;
  return newState;
};

export const roundOff = roundOff => Math.floor(roundOff * 100) / 100;
export const calculateStats = (player, prize) => {
  const won = player.won || 0;
  const bagelWon = player.bagelWon || 0;
  const lost = player.lost || 0;
  const bagelLost = player.bagelLost || 0;
  return {
    played: won + lost,
    winPercentage: roundOff((won / (won + lost)) * 100),
    prizeMoney:
      won * +prize + bagelWon * +prize - lost * +prize - bagelLost * +prize
  };
};

export const getGroupImageUrl = url => {
  const [file, ext] = getFileNameAndExt(url);

  return `https://firebasestorage.googleapis.com/v0/b/tennis-schiit.appspot.com/o/${encodeURIComponent(
    file + "_414x260." + ext
  )}?alt=media`;
};

export const getGroupImageUrlFull = url => {
  const [file, ext] = getFileNameAndExt(url);

  return `https://firebasestorage.googleapis.com/v0/b/tennis-schiit.appspot.com/o/${encodeURIComponent(
    file + "." + ext
  )}?alt=media`;
};

export const getUserAvatarUrl = url => {
  const [file, ext] = getFileNameAndExt(url);

  return `https://firebasestorage.googleapis.com/v0/b/tennis-schiit.appspot.com/o/${encodeURIComponent(
    file + "_200x200." + ext
  )}?alt=media`;
};

export const getFileNameAndExt = url => {
  const {
    groups: { ext, file }
  } = <any>/^(?<file>.*)\.(?<ext>.*)$/.exec(url);
  return [file, ext];
};

export const getHandyCap = val => {
  switch (+val) {
    case 0.15:
      return "15:0";
    case 1:
      return "1-0";
    case 1.15:
      return "1-0 + 15:0";
    case 2:
      return "2-0";
    case 2.15:
      return "2-0 + 15:0";
    case 0.3:
      return "30:0";
    case 3:
      return "3-0";

    case -0.15:
      return "0:15";
    case -1:
      return "0-1";
    case -1.15:
      return "0-1 + 0:15";
    case -2:
      return "0-2";
    case -2.15:
      return "0-2 + 0:15";
    case -0.3:
      return "0:30";
    case -3:
      return "0-3";

    default:
      return "";
  }
};

export const getPlayersName = (players, allPlayers) => {
  return Object.keys(players).map(x =>
    allPlayers[x] ? allPlayers[x].name : "NA"
  );
};
export const getPlayersNameAsString = (p, allP) =>
  getPlayersName(p, allP).join("/");

export const getPossibleVerse = (players, group1, group2) =>
  R.flatten(
    Object.keys(group1).map(x =>
      Object.keys(group2).map(y => ({
        label: `${players[x].name} vs ${players[y].name}`,
        player1: { [x]: true },
        player2: { [y]: true }
      }))
    )
  );

export const getPlayers = players => {
  const keys = Object.keys(players);
  return {
    player1: keys[0],
    ...(keys.length > 1 && {
      player2: keys[1]
    })
  };
};

export const hashCode = s =>
  s.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

export const toChartDate = d => {
  const now = addSeconds(new Date(1970, 1, 1), d);
  return [now.getFullYear(), now.getMonth(), now.getDate()].join("/");
};

export const getUrlAvatar = uid =>
  `https://firebasestorage.googleapis.com/v0/b/tennis-schiit.appspot.com/o/images%2Favatar_${uid}_200x200.png?alt=media`;

export const isInstalled = () =>
  "standalone" in window.navigator && window.navigator["standalone"];

export const shareLink = (data: ShareData) => {
  if ("share" in window.navigator) {
    (window.navigator as any)
      .share({
        title: "web.dev",
        text: "Check out web.dev.",
        url: "https://web.dev/"
      })
      .then(() => console.log("Successful share"))
      .catch(error => console.log("Error sharing", error));
  } else {
    console.log("app is not installed mode");
  }
};

export interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}
