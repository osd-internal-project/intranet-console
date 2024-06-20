export type ITPagination = {
  current: number;
  pageSize: number;
};

export type ITCustomerForSelect = {
  id: number;
  firstNameTh?: string;
  lastNameTh?: string;
  prefixTh?: string;
};
export type ITBranchForSelect = {
  id: number;
  branchName: string;
  customerAddress: ITBranchAddress[];
  customerContact: ITBranchContact[];
};
export type ITBranchAddressForm = {
  addressTypeId: string;
  addressTypeName: string;
  alley: string;
  building: string;
  district: string;
  floor: string;
  houseNumber: string;
  province: string;
  road: string;
  roomNumber: string;
  subDistrict: string;
  village: string;
  zipCode: string;
};
export type ITBranchAddress = { id: number } & ITBranchAddressForm;
export type ITBranchContactForm = {
  name: string;
  nickName: string;
  position: string;
  phone: string;
  officePhone: string;
  fax: string;
  email: string;
  birthday: Date;
  activeStatus: boolean;
};
export type ITBranchContact = { id: number } & ITBranchContactForm;
