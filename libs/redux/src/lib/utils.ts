/* eslint-disable no-useless-escape */
import addSeconds from "date-fns/addSeconds";
import { flatten, path, defaultTo, pipe, inc } from "ramda";

export const defaultZero = defaultTo(0);
export const increment = pipe(
  defaultTo(0),
  inc
);

export const getFileNameAndExt = url => {
  if (!url) return [null, null];
  const {
    groups: { ext, file }
  } = /^(?<file>.*)\.(?<ext>.*)$/.exec(url) as any;
  return [file, ext];
};

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
    .length > 0 &&
  // has not left the group
  !(Object.values(group.players).find(
    x => x["linkedplayerId"] === user.uid
  ) as any).leftGroup;

export const removeById = (id, obj) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [id]: removed, ...newState } = obj;
  return newState;
};

export const roundOff = roundOff => Math.floor(roundOff * 100) / 100;
export const calculateStats = (player, prize) => {
  const won = defaultZero(player.won);
  const bagelWon = defaultZero(player.bagelWon);
  const lost = defaultZero(player.lost);
  const bagelLost = defaultZero(player.bagelLost);
  return {
    played: won + lost,
    winPercentage: roundOff((won / (won + lost)) * 100),
    prizeMoney:
      won * +prize + bagelWon * +prize - lost * +prize - bagelLost * +prize,
    won,
    lost,
    bagelLost,
    bagelWon
  };
};

export const getGroupImageUrl = (url, name) => {
  if (!url)
    return "https://dummyimage.com/414x260?text=" + encodeURIComponent(name);
  const [file, ext] = getFileNameAndExt(url);
  return file
    ? `https://firebasestorage.googleapis.com/v0/b/tennis-schiit.appspot.com/o/${encodeURIComponent(
        file + "_414x260." + ext
      )}?alt=media`
    : null;
};

export const getGroupImageUrlFull = url => {
  if (!url) return "https://dummyimage.com/414x260";
  const [file, ext] = getFileNameAndExt(url);

  return file
    ? `https://firebasestorage.googleapis.com/v0/b/tennis-schiit.appspot.com/o/${encodeURIComponent(
        file + "." + ext
      )}?alt=media`
    : "";
};

export const getUserAvatarUrl = url => {
  const [file, ext] = getFileNameAndExt(url);

  return file
    ? `https://firebasestorage.googleapis.com/v0/b/tennis-schiit.appspot.com/o/${encodeURIComponent(
        file + "_200x200." + ext
      )}?alt=media`
    : "";
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
      return "0-0";
  }
};

export const getPlayersName = (players, allPlayers) => {
  return Object.keys(players).map(x =>
    allPlayers[x] ? allPlayers[x].name : "(Left Player)"
  );
};
export const getPlayersNameAsString = (p, allP) =>
  getPlayersName(p, allP).join("/");

export const getPossibleVerse = (players, group1, group2) =>
  flatten(
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
      .share(data)
      .then(() => console.log("Successful share"))
      .catch(error => console.log("Error sharing", error));
  } else {
    console.log("app is not installed mode", data);
  }
};

export interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}
export function urlB64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function askPersmission() {
  return new Promise(function(resolve, reject) {
    const permissionResult = Notification.requestPermission(function(result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  });
}

export const isPushEnabled = () => "PushManager" in window;

export const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
};

export const getSortedResult = scores =>
  Object.values(scores).sort(
    (x, y) =>
      path(["matchDate", "seconds"], y) - path(["matchDate", "seconds"], x)
  );
