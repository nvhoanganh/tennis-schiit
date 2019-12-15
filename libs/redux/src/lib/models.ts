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
  groupId?: string;
  name: string;
  description?: string;
  imageUrl?: string;
  createdOn: Date;
  isDeleted?: boolean;
  ownerId?: string;
  players?: {
    [playerId: string]: IJoinedPlayer;
  };
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
