export type ITypeMasterRestaurant = {
  id: number;
  name: string;
  menu?: object; // หรือกำหนด type ชัดเจนถ้ารู้โครงสร้าง
  pricing?: number;
  category?: object;
  contact?: object;
  remark?: string;
  pathFIles?: string;
  createdAt: string; // หรือ Date (ขึ้นอยู่กับที่ API ส่งมา)
};

export type masterRestaurantConditons = {
  where: {
    name?: string;
    menu?: object; // หรือกำหนด type ชัดเจนถ้ารู้โครงสร้าง
    pricing?: number;
    category?: object;
  };
  take: number;
  skip: number;
};
