export interface ITMaType {
  id: number;
  name: string;
  activeStatus: Boolean;
  updatAtDate: Date;
  creatAtDate: Date;
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
export type ITMaTypeForm = {
  name: string;
  activeStatus: boolean;
};
