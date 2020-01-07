export function delay(duration): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}
export const arrayToObject = (array: any[], keymap, valuemap) => {
  return array.reduce((presV, currV) => {
    return {
      ...presV,
      [keymap(currV)]: valuemap(currV)
    };
  }, {});
};

export const isOwner = (user, group) =>
  user && group && group.owner === user.uid;
export const isMember = (user, group) =>
  user && group && group.players && !!group.players[user.uid];

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
    file + "_1000x140." + ext
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
      return "0-0";
  }
};

export const getPlayersName = (players, allPlayers) => {
  return Object.keys(players).map(x =>
    allPlayers[x] ? allPlayers[x].name : "NA"
  );
};
export const getPlayersNameAsString = (p, allP) => getPlayersName(p, allP).join("/");
