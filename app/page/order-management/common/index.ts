export type ITypeOption = {
  value: number;
  label: string;
};

export type ITypeOrder = {
  id: number;
  orderId: string;
  createdAt: Date;
  responsibleRerson: string;
  qty: number;
  total: number;
  orderLot: ITypeOrderLot[];
  status: string;
};

export type ITypeOrderShow = {
  id: number;
  orderId: string;
  createdAt: Date;
  responsibleRerson: string;
  qty: number;
  total: number;
  orderLot: ITypeOrderLot[];
  status: string;
  objectiveName?: string;
  requesterName?: string;
  requestDate?: string | Date;
  createdByName: string;
  remark?: string;
  totalPrice?: number;
  inventoryName?: string;
  locationName?: string;
  totalQty: string;
};
export type ITypeOrderLotForm = {
  inventoryLotId: number;
  lotNo: string;
  detail?: string;
  stockid: number;
  masterProductDetails: { name: string }[];
  casNo: string;
  expiredStatus: boolean;
  balance: number | undefined;
  unit: string | undefined;
  qty: number;
  price: number;
  orderPrice: number;
  groupId?: number;
  groupName?: string;
  chemicalFormula?: string;
  brand?: string;
  vender?: string;
};
export type ITypeOrderForm = {
  createdById?: string;
  createdByName?: string;
  objectiveId?: number;
  objectiveName?: string;
  requestDate: Date;
  requesterName: string;
  remark: string;
  inventory: { connect: { id: number } };
};
export type ITypeMasterProductCategory = {
  id: number;
  categoryName: string;
};
export type ITypeObjective = {
  objectiveId: number;
  objectiveName: string;
};

export type ITypeMasterProductGroup = {
  id: number;
  groupName: string;
};
export type ITypeMasterGhsType = {
  id: number;
  nameGhs: string;
};
export type ITypeBrand = {
  id: number;
  name: string;
};

export type ITypeVender = {
  id: number;
  venderName: string;
};
export type ITypeLocation = {
  id: number;
  locationName: string;
};

export type ITypeUnit = {
  id: number;
  unitName: string;
};

export type ITypeMasterProductLocationMap = {
  locationId: number;
};
export type ITypeMasterProductGhsMap = {
  ghsId: number;
};
export type ITypeMasterLocation = {
  inventory: any;
  id: number;
  locationId: string;
  locationName: string;
  status: boolean;
};
export type ITypeMasterLocationByGroup = {
  id: number;
  locationId: string;
  locationName: string;
  status: boolean;
  inventory: {
    id: number;
    inventoryName: string;
  }[];
};

export type ITypeMasterProduct = {
  id: number;
  masterProductDetails: { name: string }[];
  chemicalFormula: string;
  casNo: string;
  description: string;
  masterProductGhsMap?: {
    masterGhsType: {
      id: number;
      nameGhs: string;
      ghsId: string;
      imagesGhs: { idfile: string }[];
    };
  }[];
  unit?: { unitName: string };
  masterProductGroup: {
    groupName: string;
    masterProductCategories: { categoryName: string };
    masterProductGroupMapType: { typeName: string }[];
  };
  masterProductImages: { idfile: string }[];
  images?: Blob;
  imagesGhs?: { blob: Blob }[];
  createdAt: Date;
  notiExpiry: boolean;
  beforeExpiry: number;
  balance?: number;
  inventoryStock: { id: number }[];
};
export type ITypeOrderLot = {
  id: number;
  stockid: number;
  productName?: string;
  masterProductDetails?: { name: string }[];
  casNo: string;
  group: string;
  balance: string;
  unit: number;
  total: number;
  groupName: string;
  expiredStatus: boolean;
  qty: number;
  totalPrice: number;
};
