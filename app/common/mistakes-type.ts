export interface ITMistakesType {
  id: number;
  typeId: string;
  typeName: string;
  detail: string;
  status: boolean;
  createdAt: string; // หรือ Date ถ้าแปลงแล้ว
  updatedAt: string; // หรือ Date
  employeePropertyId?: number | null;
}
