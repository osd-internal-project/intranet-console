export interface ITMaDetail {
  id: number;
  maName: string;
  maStatus: string;
  maTypeId: number;
  maTypeName: string;
  maDate?: Date;
  detail?: string;
  contact?: string;
  remake?: string;
  updatedDate: Date;
  createdDate: Date;
  refId?: number;
}

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

export interface ITMaType {
  id: number;
  name: string;
}
