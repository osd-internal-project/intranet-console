export type UserProfile = {
  userId: string;
  username: string;
  fullName: string;
  email: string;
  levelId: number;
};

export type TPagination = {
  current: number;
  pageSize: number;
};