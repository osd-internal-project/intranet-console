export interface typedata {
  id: number;
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
  casNo: string;
}
export interface ITypePageConfig {
  skip: number;
  take: number;
}
export interface ITypeSearchShow {
  label: string;
  value: any;
}
