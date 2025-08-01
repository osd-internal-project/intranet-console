export type ITMasterProduct = {
  id: number;
  prdId: string;
  prdName: string;
  prdImageId?: string;
  responsible?: string;
  description?: string;
  updatedBy?: string;
  expired: Date;
  createdAt: Date;
  updatedAt: Date;
  unitId: string;
  masterProductImage?: any[];
  unit?: { unitID: string };
};

export type ITMasterProductCreateInput = {
  id?: number;
  prdId?: string;
  prdName: string;
  prdImageId?: string;
  responsible: string;
  description?: string;
  updatedBy: string;
  expired: Date | string;
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
