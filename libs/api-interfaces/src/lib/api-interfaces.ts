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

export const Mocked_Players: Player[] = [
  {
    id: "Anguyen",
    displayName: "Hoang anh",
    email: "nvhoanganh1909@gmail.com",
    lastWeekPrizeMoney: 34,
    prizeMoney: 40,
    lastWeekWinPercentage: 35.33,
    winPercentage: 35
  },
  {
    id: "Anguyen2",
    displayName: "Tuan Xiu",
    email: "nvhoanganh1909@gmail.com",
    lastWeekPrizeMoney: 34,
    prizeMoney: 40,
    lastWeekWinPercentage: 35.33,
    winPercentage: 35
  },
  {
    id: "Anguyen3",
    displayName: "a Thang",
    email: "nvhoanganh1909@gmail.com",
    lastWeekPrizeMoney: 34,
    prizeMoney: -40,
    lastWeekWinPercentage: 35.33,
    winPercentage: -35
  },
  {
    id: "Anguyen4",
    displayName: "Tuan Nhu",
    email: "nvhoanganh1909@gmail.com",
    lastWeekPrizeMoney: 34,
    prizeMoney: -40,
    lastWeekWinPercentage: 35.33,
    winPercentage: -35
  },
  {
    id: "Anguyen5",
    displayName: "Cuong",
    email: "nvhoanganh1909@gmail.com",
    lastWeekPrizeMoney: 34,
    prizeMoney: -50,
    lastWeekWinPercentage: 35.33,
    winPercentage: -35
  },
  {
    id: "Anguyen6",
    displayName: "Hoang",
    email: "nvhoanganh1909@gmail.com",
    lastWeekPrizeMoney: 34,
    prizeMoney: 40,
    lastWeekWinPercentage: 35.33,
    winPercentage: 35
  },
  {
    id: "Anguyen7",
    displayName: "Tu Hoang",
    email: "nvhoanganh1909@gmail.com",
    lastWeekPrizeMoney: 34,
    prizeMoney: 40,
    lastWeekWinPercentage: 35.33,
    winPercentage: 35
  },
  {
    id: "Anguyen8",
    displayName: "Viet",
    email: "nvhoanganh1909@gmail.com",
    lastWeekPrizeMoney: 34,
    prizeMoney: -40,
    lastWeekWinPercentage: 35.33,
    winPercentage: -35
  },
  {
    id: "Anguyen9",
    displayName: "Phuc",
    email: "nvhoanganh1909@gmail.com",
    lastWeekPrizeMoney: 34,
    prizeMoney: 40,
    lastWeekWinPercentage: 35.33,
    winPercentage: 35
  }
];
