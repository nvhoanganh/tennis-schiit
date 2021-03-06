/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSelector } from "reselect";
import { pipe, groupBy, map, sortBy, sort, path, prop } from "ramda";
import { SORT_TRUESKILL, SORT_WINPERCENT } from "../models";
import { arrayToObject, calculateStats, isMember, roundOff } from "../utils";
const getPlayers = state => state.players;
const getGroups = state => state.groups;
const getScoresState = state => state.scores;
const getAppState = state => state.app;
const getLeaderboardState = state => state.leaderboard;

export const getCurrentUser = createSelector(
  getAppState,
  s => s.user
);
export const getShowToast = createSelector(
  getAppState,
  s => s.showToast
);
export const getPwaHandle = createSelector(
  getAppState,
  s => s.pwaHandle
);

export const getAllGroups = createSelector(
  getGroups,
  s => s
);

export const getScores = createSelector(
  getScoresState,
  s => s.entities
);

export const getScoresSortedByDate = createSelector(
  getScoresState,
  s => {
    const f = pipe(
      Object.values,
      groupBy(m => m.matchDate.seconds),
      map(
        pipe(
          sortBy(x =>
            /// old records doesn't have timestamp field yet
            x.timestamp ? x.timestamp.seconds : x.matchDate.seconds
          )
        )
      ),
      Object.values,
      map(x => ({
        matchDate: x[0].matchDate.toDate(),
        matches: x
      })),
      sort((a, b) => b.matchDate - a.matchDate)
    );
    return f(s.entities);
  }
);
export const getGroupUser = createSelector(
  getLeaderboardState,
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

export const getAppLoadError = createSelector(
  getAppState,
  s => s.getAppLoadError
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

export const getUserTurnedOnPushNotification = createSelector(
  getCurrLeaderGroup,
  getCurrentUser,
  (group, user) => {
    return (
      group &&
      group.webPush &&
      user &&
      user.uid in group.webPush &&
      group.webPush[user.uid] &&
      Object.values(group.webPush[user.uid]).length > 0
    );
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
        id: (x as any).userId,
        email: (x as any).email,
        name: (x as any).name
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

    // enhance the group player
    const players = Object.values(group.players).map(({ ...gp }) => {
      const player = leaderboard.players[gp.userId];

      if (!player) {
        // not played yet
        return { id: gp.userId, ...gp };
      }
      return {
        ...player,
        ...gp,
        id: gp.userId,
        score: roundOff(player.score),
        previousScore: roundOff(player.previousScore),
        ...calculateStats(player, prize)
      };
    });

    return players.sort((x, y) => {
      const srtCol =
        sortBy === SORT_TRUESKILL
          ? "score"
          : sortBy === SORT_WINPERCENT
          ? "winPercentage"
          : "prizeMoney";
      return (y[srtCol] || 0) - (x[srtCol] || 0);
    });
  }
);

export const getActivePlayersForGroup = createSelector(
  getLeaderboardPlayers,
  players => players.filter(x => !x.leftGroup)
);

export const getLeaderboardPlayersObj = createSelector(
  getLeaderboardPlayers,
  players => arrayToObject(players, x => x.id, x => x)
);
export const getLeaderBoardGroupUser = createSelector(
  getLeaderboardPlayersObj,
  getGroupUser,
  (players, user) => (!user ? null : { ...players[user.playerId], ...user })
);

export const playerOtherGroups = createSelector(
  getLeaderBoardGroupUser,
  getAllGroups,
  (player, allGroups) =>
    Object.values(allGroups)
      .filter((x: any) => !x.deletedDate)
      .filter((x: any) => x.groupId in (path(["groups"], player) || {}))
);

export const getMyGroups = createSelector(
  getCurrentUser,
  getGroups,
  (user, groups) => {
    if (!user) return [];
    const sortByName = sortBy(prop("name"));
    return sortByName(
      Object.values(groups)
        .filter((x: any) => !x.deletedDate)
        .filter(x => isMember(user, x))
    );
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
    return Object.values(groups)
      .filter((x: any) => !x.deletedDate)
      .filter(x => !isMember(user, x));
  }
);
