export type ITypeOption = {
  value: number;
  label: string;
};

export type ITypeMasterLocation = {
  inventory: any;
  id: number;
  locationId: string;
  locationName: string;
  status: boolean;
};

export type ITypeDataTable = {
  notiExpiryDate: Date;
  expiryDate: Date;
  notiExpiryStatus: boolean;

  inventoryStock: {
    masterProduct: {
      casNo: string;
      masterProductDetails: { name: string }[];
      unit: { unitName: string };
    };
    inventory: {
      inventoryName: string;
      location: {
        locationName: string;
      };
    };
  };
  lotNo: string;

  remain: number;
};
