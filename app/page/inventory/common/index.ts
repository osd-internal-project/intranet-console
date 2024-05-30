export type ITypeBrand = {
  id: number;
  name: string;
};

export type ITypeVender = {
  id: number;
  venderName: string;
};
export type ITypeOption = {
  value: number;
  label: string;
};

export type ITypeImagesGHS = {
  masterGhsType: {
    ghsId: string;
    id: number;
    nameGhs: string;
    imagesGhs: { blob: Blob; idfile?: string }[];
  };
};

export type ITypeInventory = {
  beforeExpiry: number;
  casNo: string;
  chemicalFormula: string;
  createdAt: Date;
  description: string;
  id: number;
  masterProductHazardtypeMap?: {
    masterHazardtype: { id: number; nameHazard: string };
  }[];
  inventoryStock: { id: number; inventoryLot: [] }[];
  hyperlink?: string;
  brandName?: string;
  venderName?: string;
  masterProductDetails: [];
  masterProductGhsMap: [];
  masterProductGroup: {
    groupName?: string;
    masterProductCategories: {
      categoryName: string;
    };
    masterProductGroupMapType?: {
      typeName: string;
    }[];
  };
  masterProductImages: {
    createdAt: Date;
    id: number;
    idfile: string;
    namefile: string;
    path: string;
    productId: number;
    updatedAt: Date;
  }[];
  maximumStock: number;
  minimumStock: number;
  notiExpiry: boolean;
  unit: { unitName: string };
  updatedByName: string;
  countlot: number;
  imagefile?: Blob;
  imagefileGHS?: { imagefile: Blob }[];
  masterProductFiles: any[];
};
export interface ITypeInventoryFIlters {
  id: number;
  inventoryId: string;
  inventoryNumber: string;
  inventoryName: string;
  status: boolean;
  locationPlace: string;
  phoneNumber: string;
  createdAt: Date[];
  updatedAt: Date;
  locationId: number;
  // inventoryStock  inventoryStock[]
  // order           order[]
}
export type filterproductlist = {
  productName?: string;
  chemicalFormula?: string;
  unitName?: string;
  casNo?: string;
  minumumStock?: boolean;
};
