import trueskill from "trueskill";

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

const gameDifference = (
  winners,
  gameWonByLostTeam,
  reverseBagel,
  isAverage
) => {
  const players = [];
  Object.keys(winners).forEach(k => {
    const p = winners[k];
    p.won = p.won || 0;
    p.lost = p.lost || 0;
    const preScore = p.score || 0;
    const isBagel = reverseBagel || +gameWonByLostTeam === 0;
    const gameDiff = (+gameWonByLostTeam < 6 ? 6 : 7) - +gameWonByLostTeam;
    p.score = preScore + gameDiff + (isBagel || reverseBagel ? 2 : 0);
    p.previousScore = preScore;
    if (isAverage) {
      p.score = p.score / (p.lost + p.won);
    }
    players.push(p);
  });
};

export const ScoreEngine = {
  gameDifference,
  truSkill
};
