export interface ITComplainProblem {
  id: number;
  name: string;
  userId: string;
  detail: string;
  status: boolean;
  createdAt: string; // หรือ Date ถ้าแปลงแล้ว
  updatedAt: string; // หรือ Date
  users: { userId: string; firstNameTh: string; lastNameTh: string };
}
