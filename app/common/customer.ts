export type ITCustomerGroupForm = {
  customerGroupCode: string;
  customerGroupName: string;
  description?: string;
};
export type ITCustomerGroup = {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
} & ITCustomerGroupForm;

export type ITCustomerForm = {
  activeStatus: boolean;
  companyRegisNumber?: string;
  customerCode?: string;
  customerTypeGroupId?: number;
  customerTypeGroupName?: string;
  departmentCode?: string;

  grade?: string;
  details?: {
    prefixEn?: string;
    prefixTh?: string;
    firstNameEn?: string;
    firstNameTh?: string;
    lastNameEn?: string;
    lastNameTh?: string;
    customerNameTh?: string;
    customerNameEn?: string;
  };

  notiEmail?: string;
  notiFax?: string;
  notiMap?: string;
  notiPhone?: string;

  referenceCode?: string;
  regisDate?: Date;
  registration?: number;
  responsibleId?: string[];
  responsible?: { uid: string; name: string }[];
  responsibleName?: string;
  thirdPartyId?: number;
  thirdPartyName?: string;
  customerTypeId?: string;
  customerTypeName?: string;
  taxAlley?: string;
  businessCategory?: string;
  objective?: string;
};
export type ITCustomer = {
  id: number;
} & ITCustomerForm;

export type ITPagination = {
  current: number;
  pageSize: number;
};
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
export type ITBranchForm = {
  id: number;
  branchCode: string;
  branchName: string;
  activeStatus?: boolean;
  remark?: string;
};

export type ITBranch = { id: number } & ITBranchForm;
export type ITBranchAddressForm = {
  addressTypeId?: string;
  addressTypeName?: string;
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
export type ITBranchDetail = {
  id: number;
  customerAddress: ITBranchAddress[];
  customerContact: ITBranchContact[];
} & ITBranchForm;
export type ITCustomerSubForm = {
  id: number;
  code: string;
  name: string;
  activeStatus?: boolean;
};
export type ITCustomerSub = { id: number } & ITCustomerSubForm;
export type ITCustomerSubDetail = {
  id: number;
  customerBranch?: ITBranch[];
} & ITBranchForm;
export type ITConfigData = { id: number; name: string; customerTypeId: string };
export type ITSelectUsers = {
  userId: string;
  firstNameTh: string;
  lastNameTh: string;
};
