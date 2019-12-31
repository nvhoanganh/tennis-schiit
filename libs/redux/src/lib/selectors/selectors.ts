import { createSelector } from "reselect";
import { isMember, arrayToObject } from "../utils";
import { SORT_TRUESKILL, SORT_WINPERCENT } from "../models";
import players from "../reducers/playersReducer";
const getPlayers = state => state.players;
const getGroups = state => state.groups;
const getScoresState = state => state.scores;
const getAppState = state => state.app;
const getLeaderboardState = state => state.leaderboard;

export const getCurrentUser = createSelector(
  getAppState,
  s => s.user
);
export const getScores = createSelector(
  getScoresState,
  s => s.entities
);
export const getGroupUser = createSelector(
  getGroups,
  s => s.user
);

export const getHasMore = createSelector(
  getScoresState,
  s => s.hasMore
);
export const getLastDoc = createSelector(
  getScoresState,
  s => s.lastDoc
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
    const { prize, sortBy } = leaderboard.tournament || {
      prize: "5",
      sortBy: SORT_TRUESKILL
    };

    const roundOff = roundOff => Math.floor(roundOff * 100) / 100;
    // enhance the group player
    let players = Object.values(group.players).map(
      ({ userId, name, email, linkedplayerId }) => {
        const player = leaderboard.players[userId];

        if (!player) {
          // not played yet
          return { id: userId, name, email, linkedplayerId };
        }
        const won = player.won || 0;
        const bagelWon = player.bagelWon || 0;
        const lost = player.lost || 0;
        const bagelLost = player.bagelLost || 0;
        return {
          ...player,
          id: userId,
          score: roundOff(player.score),
          linkedplayerId,
          previousScore: roundOff(player.previousScore),
          played: won + lost,
          winPercentage: roundOff((won / (won + lost)) * 100),
          name,
          email,
          prizeMoney:
            won * +prize +
            bagelWon * +prize -
            lost * +prize -
            bagelLost * +prize
        };
      }
    );

    return players.sort((x, y) => {
      const srtCol =
        sortBy === SORT_TRUESKILL
          ? "score"
          : sortBy === SORT_WINPERCENT
          ? "winPercentage"
          : "prizeMoney";
      return y[srtCol] - x[srtCol];
    });
  }
);

export const getLeaderboardPlayersObj = createSelector(
  getLeaderboardPlayers,
  players => arrayToObject(players, x => x.id, x => x)
);
export const getLeaderBoardGroupUser = createSelector(
  getLeaderboardPlayersObj,
  getGroupUser,
  (players, user) => (!user ? null : players[user.uid])
);
export const getMyGroups = createSelector(
  getCurrentUser,
  getGroups,
  (user, groups) => {
    if (!user) return [];
    return Object.values(groups).filter(x => isMember(user, x));
  }
);

export const getIsPendingJoin = createSelector(
  getCurrentUser,
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
  getCurrentUser,
  getGroups,
  (user, groups) => {
    if (!user) return Object.values(groups);
    return Object.values(groups).filter(x => !isMember(user, x));
  }
);
