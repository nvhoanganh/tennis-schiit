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
export const PLAYERS = "players";
