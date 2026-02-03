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
  createdAt: string; // หรือ Date ถ้า parse แล้ว
  updatedAt: string; // หรือ Date ถ้า parse แล้ว
  users: User;
  mistakesType: ITMistakesType[];
  imageUrl: string;
}

export interface User {
  id: number;
  userId: string;
  firstNameEn: string;
  lastNameEn: string;
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
