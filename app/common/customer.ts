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
  customerGroupId: number;
  activeStatus: boolean;
  companyRegisNumber?: string;
  customerCode?: string;
  customerTypeGroupId?: number;
  customerTypeGroupName?: string;
  departmentCode?: string;
  customerNameTh?: string;
  customerNameEn?: string;
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
export type ITCustomerDetailSubForm = {
  id: number;
  code: string;
  name: string;
  activeStatus?: boolean;
  remark?: string;
  customerId?: number;
};

export type ITCustomerDetailSub = { id: number } & ITCustomerDetailSubForm;
export type ITCustomerDetailSubAddressForm = {
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
export type ITCustomerDetailSubAddress = {
  id: number;
} & ITCustomerDetailSubAddressForm;
export type ITCustomerDetailSubContactForm = {
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
export type ITCustomerDetailSubContact = {
  id: number;
} & ITCustomerDetailSubContactForm;
export type ITCustomerDetailSubDetail = {
  id: number;
  code: string;
  name: string;
  customerAddress: ITCustomerDetailSubAddress[];
  customerContact: ITCustomerDetailSubContact[];
} & ITCustomerDetailSubForm;
export type ITCustomerSubForm = {
  id: number;
  code: string;
  name: string;
  activeStatus?: boolean;
};
export type ITCustomerSub = { id: number } & ITCustomerSubForm;
export type ITCustomerSubDetail = {
  id: number;
  customerDetailSub?: ITCustomerDetailSub[];
} & ITCustomerDetailSubForm;
export type ITConfigData = { id: number; name: string; customerTypeId: string };
export type ITSelectUsers = {
  userId: string;
  firstNameTh: string;
  lastNameTh: string;
};
