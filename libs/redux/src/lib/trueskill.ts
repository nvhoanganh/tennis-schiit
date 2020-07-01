import trueskill from "trueskill";
import { roundOff } from "./utils";
const truSkill = (winners, losers) => {
  const mu = 25;
  const sigma = 3;
  const initialScore = [mu, mu / sigma];

  const players = [];
  Object.keys(winners).forEach(k => {
    const p = winners[k];
    p.rank = 1;
    p.previousScore = p.score || 0;
    p.skill = !p.skill ? initialScore : p.skill;
    players.push(p);
  });

  Object.keys(losers).forEach(k => {
    const p = losers[k];
    p.rank = 2; // loser
    p.previousScore = p.score || 0;
    p.skill = !p.skill ? initialScore : p.skill;
    players.push(p);
  });

  // update
  trueskill.AdjustPlayers(players);
  players.forEach(p => {
    p.score = p.skill[0] - 3 * p.skill[1];
  });
};

const gameDifference = (winners, gameWonByLostTeam, reverseBagel) => {
  const players = [];
  Object.keys(winners).forEach(k => {
    const p = winners[k];
    p.previousScore = p.score || 0;
    const isBagel = reverseBagel || +gameWonByLostTeam === 0;
    const gameDiff = (+gameWonByLostTeam < 5 ? 6 : 7) - +gameWonByLostTeam;
    p.score = p.previousScore + gameDiff + (isBagel || reverseBagel ? 2 : 0);

    players.push(p);
  });
};

const gameWon = (winners, losers, gameWonByLostTeam, reverseBagel) => {
  const players = [];

  Object.keys(winners).forEach(k => {
    const p = winners[k];
    p.previousScore = p.score || 0;

    const isBagel = reverseBagel || +gameWonByLostTeam === 0;
    const gameWon = +gameWonByLostTeam < 5 ? 6 : 7;
    p.score = p.previousScore + gameWon + (isBagel || reverseBagel ? 2 : 0);

    players.push(p);
  });

  Object.keys(losers).forEach(k => {
    const p = losers[k];
    p.previousScore = p.score || 0;
    const gameWon = +gameWonByLostTeam;
    p.score = p.previousScore + gameWon;

    players.push(p);
  });
};

export const ScoreEngine = {
  gameDifference,
  truSkill,
  gameWon
};
