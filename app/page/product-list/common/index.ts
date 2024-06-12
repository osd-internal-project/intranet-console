export type ITypeOption = {
  value: number;
  label: string;
};
export type ITypeMasterProductCategory = {
  id: number;
  categoryName: string;
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

export type ITypeMasterProductForm = {
  id?: number;
  masterProductDetails: { name: string }[];
  chemicalFormula?: string;
  casNo: string;
  undertaker?: string;
  description?: string;
  ghsId?: number;
  ghsName?: string;
  brandId?: number;
  brandName?: string;
  venderId?: number;
  venderName?: string;
  minimumStock: number;
  maximumStock: number;
  beforeExpiry: number;
  notiExpiry: boolean;
  updatedById?: string;
  updatedByName?: string;
  hyperlink?: string;
  masterProductGroup?: {
    connect: {
      id: number;
    };
  };
  unit?: {
    connect: {
      id: number;
    };
  };
  masterProductLocationMap: {
    createMany: { data: ITypeMasterProductLocationMap[] };
  };
  masterProductGhsMap: {
    createMany: { data: ITypeMasterProductLocationMap[] };
  };
};
export type ITypeMasterProductLocationMap = {
  locationId: number;
};
export type ITypeMasterProductGhsMap = {
  ghsId: number;
};
export type ITypeMasterLocation = {
  id: number;
  locationId: string;
  locationName: string;
  status: boolean;
};

export type ITypeMasterProduct = {
  id: number;
  details: { name: string[] };
  chemicalFormula: string;
  casNo: string;
  brandName?: string;
  venderName?: string;
  hyperlink: string;
  description: string;
  masterProductHazardtypeMap?: {
    masterHazardtype: { id: number; nameHazard: string };
  }[];
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
  masterProductLocationMap: {
    location: { locationName: string };
  }[];
  masterProductImages: { idfile: string }[];
  images?: Blob;
  imagesGhs?: { imagefile: Blob }[];
  createdAt: Date;
  notiExpiry: boolean;
  beforeExpiry: number;
  inventoryStock?: any;
  imagefile?: Blob;
  imagefileGHS?: { imagefile: Blob }[];
  maximumStock: number;
  minimumStock: number;
  updatedByName?: string;
  masterProductDetails: { name: string }[];
  masterProductFiles: any[];
};

export type typeImagesGHS = {
  masterGhsType: {
    ghsId: string;
    id: number;
    nameGhs: string;
    imagesGhs: { blob: Blob; idfile?: string }[];
  };
};
export type typeImages = {
  id: number;
  idfile: string;
  namefile: string;
  createdAt: string;
  updatedAt: string;
  productId: number;
  path: string;
};

export type filterproductlist = {
  productName?: string;
  chemicalFormula?: string;
  unitName?: string;
  casNo?: string;
  minumumStock?: boolean;
};

export type inventoryLot = {
  id: number;
  lotNo: string;
  qty: number;
  remain: number;
  price: number;
  totalPrice: number;
  updateId: string;
  updateName: string;
  receiptDate: Date;
  detail: string;
  expiryDate: Date;
  productionDate: Date;
  venderId: number;
  venderName: string;
  brandId: number;
  brandName: string;
  ownerGroup: string;
  minimumStock: string;
  inventoryStock: { masterProduct: { unit: { unitName: string } } };
};

export type masterProductInSubTable = {
  id: number;
  unit: {
    unitName: string;
  };
  inventoryStock: {
    id: number;
    inventory: {
      inventoryName: string;
      location: {
        locationId: string;
        locationName: string;
      };
      locationPlace: string;
    };
  }[];
};

export type inventoryStockByProduct = {
  id?: number;
  unit?: string;
  inventoryName?: string;
  locationName?: string;
  locationPlace?: string;
  remainQty?: number;
  expiryQty?: number;
};
export type ITypeConfigPage = { total: number; current: number };
