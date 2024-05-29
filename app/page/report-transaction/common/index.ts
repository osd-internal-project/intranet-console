export interface typedata {
  person: any;
  payfor: any;
  id: number;
  casNo: string;
  productName: string;
  location: string;
  inventory: string;
  chemicalFormula: string;
  groupId: string;
  groupName: string;
  vender: string;
  brand: string;
  status: string;
  qty: number;
  unit: string;
  updatedAt: any;
  updatedById: string;
  updatedByName: string;
}

export interface ITypePageConfig {
  skip: number;
  take: number;
}
export interface ITypeRequester {
  id: number;
  userId: string;
  firstNameTh: string;
  lastNameTh: string;
  ownerGroup: {
    groupId: string;
    groupName: string;
  };
}
