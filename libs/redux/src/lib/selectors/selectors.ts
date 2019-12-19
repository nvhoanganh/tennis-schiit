import { createSelector } from "reselect";
import { isMember } from "../utils";
const getPlayers = state => state.players;
const getGroups = state => state.groups;
const getAppState = state => state.app;

export const getUser = createSelector(
  getAppState,
  s => s.user
);

export const getPlayerList = createSelector(
  getPlayers,
  s => Object.values(s)
);

export const getAppIsLoaded = createSelector(
  getAppState,
  s => s.appLoaded
);
export const getLeaderboardPlayers = createSelector(
  getPlayers,
  players => {
    if (!players) return [];
    const toPercent = x => Math.floor(x * 100) / 100;
    const p = Object.keys(players).map((k, i) => ({
      id: k,
      played: players[k].won + players[k].lost,
      winPercentage: toPercent(
        (players[k].won / (players[k].won + players[k].lost)) * 100
      ),
      prizeMoney:
        players[k].won * 5 +
        players[k].bagelWon * 10 -
        players[k].lost * 5 -
        players[k].bagelLost * 10,
      ...players[k]
    }));
    return p;
  }
);

export const getMyGroups = createSelector(
  getUser,
  getGroups,
  (user, groups) => {
    if (!user) return [];
    return Object.values(groups).filter(x => isMember(user, x));
  }
);

export const getGroupNotMemberOff = createSelector(
  getUser,
  getGroups,
  (user, groups) => {
    if (!user) return Object.values(groups);
    return Object.values(groups).filter(x => !isMember(user, x));
  }
);
