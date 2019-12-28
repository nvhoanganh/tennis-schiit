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
  s => s.pendingRequests > 0
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

export const getLoadingLeaderboard = createSelector(
  getLeaderboardState,
  s => s.loading
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
    if (!group.players) return [];
    const toPercent = x => Math.floor(x * 100) / 100;
    // enhance the group player
    let players = Object.values(group.players).map(
      ({ userId, name, email }) => {
        const player = leaderboard.players[userId];
        if (!player) {
          // not played yet
          return { id: userId, name, email };
        }
        const won = player.won || 0;
        const bagelWon = player.bagelWon || 0;
        const lost = player.lost || 0;
        const bagelLost = player.bagelLost || 0;
        return {
          ...player,
          id: userId,
          score: won * 5 + bagelWon * 5 - lost * 5 - bagelLost * 5, // for now
          played: won + lost,
          winPercentage: toPercent((won / (won + lost)) * 100),
          name,
          email,
          prizeMoney: won * 5 + bagelWon * 5 - lost * 5 - bagelLost * 5
        };
      }
    );

    return players.sort((x, y) => {
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

export const getIsPendingJoin = createSelector(
  getUser,
  getCurrLeaderGroup,
  (user, group) => {
    if (!user || !group) return false;
    if (!group.pendingJoinRequests) return false;
    return group.pendingJoinRequests[user.uid];
  }
);

export const getPendingJoinRequest = createSelector(
  getCurrLeaderGroup,
  group => {
    if (!group) return [];
    if (!group.pendingJoinRequests) return [];
    return Object.values(group.pendingJoinRequests);
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
