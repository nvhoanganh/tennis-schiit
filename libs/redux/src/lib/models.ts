export interface IScore {
  scoreId?: string;
  groupId: string;
  tournamentId: string;
  date: Date;
  winner1: string;
  winner2?: string;
  loser1: string;
  loser2?: string;
  losingScore: number;
  isBagel: boolean;
}

export interface IGroup {
  id?: string;
  name: string;
  description?: string;
  currentTournament?: string;
  lastMatch?: Date;
  createdOn: Date;
  owner: string;
  played?: number;
  players?: any[];
  pendingJoinRequests?: any;
}

export interface IPlayer {
  playerId?: string;
  displayName: string;
  email: string;
  leftHanded: boolean;
  singleHandedBackhand: boolean;
  avatarUrl?: string;
  isDeleted?: boolean;
  createdOn: Date;
  groupId?: string;
  inviteToken?: string;
  inviteDate?: Date;
}

export interface IJoinedPlayer {
  dateJoined?: Date;
}

export interface IPager {
  offset: number;
  count: number;
}

export interface ISignInModel {
  email: string;
  password: string;
}

export const GROUPS = "groups";
export const USERS = "users";
export const TOURNAMENTS = "tournaments";
export const SCORES = "scores";
export const STATS = "stats";
export const PLAYERS = "players";
export const SORT_TRUESKILL = "TrueSkill";
export const SORT_WINPERCENT = "Win Percentage";
export const SORT_PRIZEMONEY = "Prize Money";
export const SORT_GAMEDIFFERENCE = "Total Games Difference";
export const SORT_GAMEDIFFERENCE_AVG = "Total Games Difference/Match Played";

export const SORT_TOTALGAMEWON = "Total Games Won";
export const SORT_GAMEWON_AVG = "Total Games Won/Match Played";
