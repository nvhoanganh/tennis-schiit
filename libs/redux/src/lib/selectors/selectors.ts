import { createSelector } from "reselect";
const getPlayers = state => state.players;

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
