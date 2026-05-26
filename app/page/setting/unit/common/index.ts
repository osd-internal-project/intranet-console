export type ITUnit = {
  id: number;
  unitID: string;
  unitName: string;
  status?: boolean;
  createdAt: string;
  updatedAt: string;
  masterProduct?: ITMasterProduct[];
};

export type ITMasterProduct = {
  id: number;
  prdId: string;
  prdName: string;
  prdImageId?: string;
  responsible: string;
  description?: string;
  updatedBy: string;
  expired: string;
  createdAt: string;
  updatedAt: string;
  unitId?: number;
};

export type ITUnitCreateInput = {
  id?: number;
  unitID?: string;
  unitName?: string;
  status?: boolean | null;
};
