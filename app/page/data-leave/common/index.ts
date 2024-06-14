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

export interface ITpyeUser {
  activeStatus: boolean;
  clientId: string;
  createdAt: Date;
  email: string;
  firstNameEn: string;
  firstNameTh: string;
  id: number;
  lastNameEn: string;
  lastNameTh: string;
  organizedGroupId: number;
  ownerGroupId: number;
  password: string;
  phoneNumber: string;
  positionId: number;
  refreshToken: string;
  startWork: Date;
  updatedAt: Date;
  userId: string;
  username: string;
  typeid?: number;
}

export interface ITypeDataLeave {
  id?: number;
  userId?: string;
  firstName?: string;
  lastName?: string;
  positionId?: number;
  position?: string;
  typeId?: number;
  typeName?: string;
  startDate: Date | null;
  startTime?: string;
  endDate?: Date | null;
  endTime?: string;
  leaveHour?: number;
  detail?: string;
  phoneNumber?: string;
  status?: string;
  approvedDate?: Date;
  userApproved?: string;
  attrachFile?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITypeDataLeaveCreate {
  id: number;
  userId: string;
  firstNameTh: string;
  lastNameTh: string;
  posId: number;
  position: string;
  type_id: number;
  typeName: string;
  startDate: Date;
  startTime: string;
  endDate: Date;
  endTime: string;
  leaveHour: number;
  detail: string;
  phoneNumber: string;
  status: string;
  approvedDate: Date;
  userApproved: string;
  attrachFile: string;
  createdAt: Date;
  updatedAt: Date;
  time_start_check: boolean;
}
