export interface ITypetypeleave {
  createdAt: Date;
  descriptionLeave: string;
  forwardLeave: string;
  id: number;
  limitLeaveFour: string;
  limitLeaveOne: string;
  limitLeaveThree: string;
  limitLeaveTwo: string;
  typeEveryDay: boolean;
  typeId: number;
  typeName: string;
  typeNameEn: string;
  typeNameTh: string;
  updatedAt: Date;
}

export interface ITypetypeleaveUpadte {
  where: {
    id: number;
  };
  data: {
    descriptionLeave: string;
    forwardLeave: string;

    limitLeaveFour: string;
    limitLeaveOne: string;
    limitLeaveThree: string;
    limitLeaveTwo: string;
    typeEveryDay: boolean;
    typeId: number;
    typeName: string;
    typeNameEn: string;
    typeNameTh: string;
    updatedAt: Date;
  };
}
export interface Filtertypeleave {
  createdAt?: Date[];
  typeName?: string;
}

export interface IDataUser {
  email?: string;
  exp?: number;
  firstNameEn?: string;
  firstNameTh?: string;
  iat?: number;
  lastNameEn?: string;
  lastNameTh?: string;
  ownerGroup?: {};
  phoneNumber?: string;
  position?: { id?: number; posId?: number; nameTh?: string; nameEn?: string; createdAt?: string };
  userId?: string;
  username?: string;
}

export interface ISelect {
  value: string | number;
  label: string;
}
