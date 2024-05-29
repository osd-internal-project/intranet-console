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
export type ITypeDepartment = {
  id: number;
  locationName: string;
};

export type ITypeUnit = {
  id: number;
  unitName: string;
};

export type ITypeMasterProductForm = {
  id?: number;
  masterProductDetails: { createMany: { data: { name: string }[] } };
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
  masterProductHazardtypeMap: {
    createMany: { data: any };
  };
  masterProductGhsMap: {
    createMany: { data: ITypeMasterProductLocationMap[] };
  };
};

export type ITypeMasterProductFormEdit = {
  masterProductDetails: { deleteMany: {}; createMany: { data: { name: string }[] } };
  chemicalFormula?: string;
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
    deleteMany: {};
    createMany: { data: ITypeMasterProductLocationMap[] };
  };
  masterProductGhsMap: {
    deleteMany: {};
    createMany: { data: ITypeMasterProductGhsMap[] };
  };
  masterProductHazardtypeMap: {
    deleteMany: {};
    createMany: { data: ITypeMasterProductHazardMap[] };
  };
};
export type ITypeMasterProductLocationMap = {
  locationId: number;
};
export type ITypeMasterProductGhsMap = {
  ghsId: number;
};
export type ITypeMasterProductHazardMap = {
  hazardId: number;
};

// export type ITypeMasterProduct = {
//   productCode: string;
//   productName: string;
//   chemicalFormula: string;
//   casNo: string;
//   group: string;
//   Category: string;
//   unit: string;
//   dateofReceipt: string;
//   expiryDate: string;
//   ghss: string[];
// };

export type ITypeMasterProduct = {
  id: number;
  masterProductDetails: { name: string }[];
  chemicalFormula: string;
  casNo: string;
  brandName: string;
  venderName: string;
  description: string;
  masterProductGroupId: number;
  masterProductGhsMap?: { masterGhsType: { id: number; nameGhs: string; ghsId: string; imagesGhs: { idfile: string }[] } }[];
  masterProductHazardtypeMap?: {
    masterHazardtype: { id: number; nameHazard: string };
  }[];
  unitId: true;
  unit?: { unitName: string };
  masterProductGroup: {
    groupName: string;
    masterProductCategories: { categoryName: string };
    masterProductGroupMapType: { typeName: string }[];
  };
  masterProductImages: { idfile: string }[];
  images?: Blob;
  imagesGhs?: { imagefile: Blob }[];
  createdAt: Date;
  notiExpiry: boolean;
  beforeExpiry: number;
  minimumStock: number;
  maximumStock: number;
  updatedByName: string;
  masterProductFiles: any[];
  hyperlink?: string;
};
export type ITypeMasterProductEdit = {
  id: number;
  masterProductDetails: { name: string }[];
  chemicalFormula: string;
  casNo: string;
  undertaker: string;
  brandName: string;
  venderName: string;
  description: string;
  masterProductGroupId: number;
  masterProductHazardtypeMap?: {
    masterHazardtype: { id: number; nameHazard: string };
  }[];
  masterProductGhsMap?: { masterGhsType: { id: number; nameGhs: string; ghsId: string; imagesGhs: { idfile: string }[] } }[];
  unitId: true;
  unit?: { unitName: string };
  masterProductGroup: {
    groupName: string;
    masterProductCategories: { id: number; categoryName: string };
    masterProductGroupMapType: { typeName: string }[];
  };
  masterProductImages: { idfile: string }[];
  images?: Blob;
  imagesGhs?: { imagefile: Blob }[];
  createdAt: Date;
  notiExpiry: boolean;
  beforeExpiry: number;
  minimumStock: number;
  maximumStock: number;
  updatedByName: string;
  masterProductFiles: any[];
  hyperlink?: string;
  masterProductLocationMap: { locationId: number }[];
};
