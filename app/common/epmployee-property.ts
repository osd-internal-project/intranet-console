import type { ITMistakesType } from "./mistakes-type";

export interface ITEmployeePropertyCommon {
  id: number;
  userId: string;
  type: string;
  name: string;
  brand: string;
  serial: string;
  assetNumber: string;
  address: string;
  assetStatus: string;
  pathImage: string;
  nameOther?: string;
  createdAt: string;
  updatedAt: string;
  users: User;
  mistakesType: ITMistakesType[];
  imageUrl: string;
  common?: boolean;
}

export interface User {
  id: number;
  userId: string;
  firstNameTh: string;
  lastNameTh: string;
  username: string;
  email: string;
  department: Department;
}
export interface Department {
  id: number;
  departId: number;
  departName: string;
  createdAt: string;
  updatedAt: string;
}
