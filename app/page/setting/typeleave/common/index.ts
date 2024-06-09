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
