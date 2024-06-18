export type ITCustomerForm = {
  activeStatus: boolean;
  companyRegisNumber?: string;
  customerCode?: string;
  customerGroupId?: number;
  customerGroupName?: string;
  departmentCode?: string;
  firstNameEn?: string;
  firstNameTh?: string;
  grade?: string;
  lastNameEn?: string;
  lastNameTh?: string;
  notiEmail?: string;
  notiFax?: string;
  notiMap?: string;
  notiPhone?: string;
  prefixEn?: string;
  prefixTh?: string;
  referenceCode?: string;
  regisDate?: Date;
  responsibleId?: string;
  responsibleName?: string;
  thirdPartyId?: string;
  thirdPartyName?: string;
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
export type ITMaTypeForm = {
  name: string;
  activeStatus: boolean;
};
