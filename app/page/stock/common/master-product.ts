import { ITOrder } from "./order";

export type ITMasterProduct = {
  id: number;
  prdId: string;
  prdName: string;
  totalQty: number;
  price: number;
  description?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  unitId: string;
  barcode?: string;
  masterProductImage?: any[];
  unit?: { unitID: string; unitName: string };
  // order?: ITOrder[];
};

export type ITMasterProductCreateInput = {
  id?: number;
  prdId?: string;
  prdName: string;
  price: number;
  totalQty?: number;
  description?: string;
  updatedBy: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type MasterProductImage = {
  id: number;
  prdImageId: string;
  fileName?: string;
  filePath?: string;
  fileType?: string;
  createdAt?: string; // or Date, depending on how you handle dates
  updatedAt?: string;
  masterProductId?: string;
  masterProduct?: ITMasterProduct; // optional relation type
};
