import { createSelector } from "reselect";
import { isMember } from "../utils";
const getPlayers = state => state.players;
const getGroups = state => state.groups;
const getAppState = state => state.app;
const getLeaderboardState = state => state.leaderboard;

export const getUser = createSelector(
  getAppState,
  s => s.user
);

export const getPlayerList = createSelector(
  getPlayers,
  s => Object.values(s)
);

export const getPendingRequests = createSelector(
  getAppState,
  s => s.pendingRequests
);
export const getAppLoaded = createSelector(
  getAppState,
  s => s.appLoaded
);

export const getAppIsLoaded = createSelector(
  getAppState,
  s => s.appLoaded
);

export const getCurrLeaderGroup = createSelector(
  getLeaderboardState,
  getGroups,
  (leaderboard, groups) => {
    return leaderboard && groups ? groups[leaderboard.groupId] : null;
  }
);

export const getCurrLeaderTournament = createSelector(
  getLeaderboardState,
  s => s.tournament
);

export const getGroupPlayers = createSelector(
  getCurrLeaderGroup,
  s => {
    if (!s) return [];
    return Object.values(s.players).map(x => {
      return {
        id: (<any>x).userId,
        email: (<any>x).email,
        name: (<any>x).name
      };
    });
  }
);
export const getLeaderboardPlayers = createSelector(
  getLeaderboardState,
  getCurrLeaderGroup,
  (leaderboard, group) => {
    if (!leaderboard || !group) return [];
    if (!leaderboard.players) return [];

    const toPercent = x => Math.floor(x * 100) / 100;
    const players = leaderboard.players;
    const p = Object.keys(players).map((k, i) => {
      const player = group.players[k];
      const won = players[k].won || 0;
      const bagelWon = players[k].bagelWon || 0;
      const lost = players[k].lost || 0;
      const bagelLost = players[k].bagelLost || 0;
      return {
        id: k,
        bagelLost,
        bagelWon,
        score: won * 5 + bagelWon * 10 - lost * 5 - bagelLost * 10, // for now
        played: won + lost,
        winPercentage: toPercent((won / (won + lost)) * 100),
        name: player ? player.name : "",
        email: player ? player.email : "",
        prizeMoney: won * 5 + bagelWon * 10 - lost * 5 - bagelLost * 10,
        ...players[k]
      };
    });
    return p.sort((x, y) => {
      return y.score - x.score;
    });
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
