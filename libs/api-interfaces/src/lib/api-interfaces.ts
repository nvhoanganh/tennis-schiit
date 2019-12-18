export interface Message {
  message: string;
}

export interface Player {
  id: string;
  displayName: string;
  email: string;
  winPercentage: number;
  lastWeekWinPercentage: number;
  prizeMoney: number;
  lastWeekPrizeMoney: number;
}

export interface GroupMember {
  playerId: string;
  joinDate: Date;
}
export interface Group {
  groupId?: string;
  name: string;
  description?: string;
  imageUrl?: string;
  createdOn: Date;
  isDeleted?: boolean;
  ownerId?: string;
  players?: GroupMember[];
}
