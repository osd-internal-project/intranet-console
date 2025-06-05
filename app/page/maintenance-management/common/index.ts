import { UploadFile } from "antd/lib";

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

export interface ITMaTask {
  id: number;
  maName: string;
  maTypeId: number;
  maTypeName: string;
  maDate: Date;
  maStatus: string;
  contact: string;
  solution?: string;
  actionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  createdByName: string;
  updatedById: string;
  updatedByName: string;
  ownerGroup: string;
  detail?: string;
  refTask?: ITMaTask;
  nextTask?: ITMaTask;
  imageList: ITMaTaskFiles[];
  fileList: ITMaTaskFiles[];
  assignUserId?: string;
  assignUsername?: string;
  maCategory?: string;
}
export interface ITMaTaskFiles {
  id: number;
  fileCode: string;
  fileName: string;
}
export type ITMaCreateForm = {
  maTypeId: number;
  maTypeName?: string;
  maName: string;
  maDate: Date;
  contact?: string;
  detail?: string;
  maStatus?: string;
  createdById?: string;
  createdByName?: string;
  assignUserId?: string;
};
export type ITPagination = {
  current: number;
  pageSize: number;
  total: number;
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
export type ITMaUpdateForm = {
  solution?: string;
  actionDate: Date;
  nextTask?: ITMaCreateForm;
  maStatus?: string;
  updatedById?: string;
  updatedByName?: string;
};
