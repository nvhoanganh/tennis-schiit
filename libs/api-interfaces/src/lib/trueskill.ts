import trueskill from "trueskill";

export const setNewScore = (winners, losers) => {
  const mu = 25;
  const sigma = 3;
  const initialScore = [mu, mu / sigma];

  let players = [];
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
