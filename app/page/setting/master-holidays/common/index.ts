export interface ITypeMasterdataHolidys {
  id: number;
  holidaysName: string;
  holidaysDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITypeMasterdataHolidysUpadte {
  where: {
    id: number;
  };
  data: {
    holidaysName: string;
    holidaysDate: Date;
    updatedAt: Date;
  };
}
export interface FilterMasterdataHolidys {
  holidaysName?: string;
  createdAt?: Date[];
}
