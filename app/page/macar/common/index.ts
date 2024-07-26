export interface MaCarType {
  id: number;
  carId: string;
  carName: string;
  carPetrol: string;
  carMile: number;
  detail: string;
  status: boolean;
  createdAt: Date;
  createdById: string;
  createdByName: string;
  updatedAt: Date;
  updatedById: string;
  updatedByName: string;
  maCarWrapup: MaCarWrapupType[];
  maCarBook: MaCarBookType[];
  maCarName: string;
  maStatus: boolean;
}

export interface MaCarBookType {
  id: number;
  carId: string;
  carName: string;
  carBookTitle: string;
  carBookProvince: string;
  carBookPlace: string;
  carBookUsers: number;
  carBookStartDate: Date;
  carBookEndDate: Date;
  carBookApprovedDate: Date;
  carBookApprovedById: string;
  carBookApprovedByName: string;
  carBookApprovedStatus: string;
  detail: string;
  remark: string;
  status: boolean;
  createdAt: Date;
  createdById: string;
  createdByName: string;
  updatedAt: Date;
  updatedById: string;
  updatedByName: string;
  recipientId: string;
  recipientName: string;
  returnNotifAt: Date;
  returnAt: Date;
  maCar: MaCarType;
}

export interface MaCarBookCalendarType {
  id: number;
  carId: string;
  carName: string;
  carPetrol: string;
  detail: string;
  carBookApprovedStatus: string;
  createdAt: Date;
  createdById: string;
  createdByName: string;
  updatedAt: Date;
  updatedById: string;
  updatedByName: string;
  carBookProvince: string;
  carBookPlace: string;
  carBookUsers: number;
  carBookStartDate: Date;
  carBookEndDate: Date;
  approveDate: string;
  carBookApprovedDate?: Date;
  carBookApprovedById?: string;
  carBookApprovedByName?: string;
  description: string;
  userName: string;
  recipientName: string;
  returnNotifAt?: Date;
  returnAt?: Date;
}

export interface MaCarWrapupType {
  id: number;
  carWrapupId: string;
  carId?: string;
  carName: string;
  typeId?: number;
  typeName: string;
  vender: string;
  cost: number;
  detail: string;
  wrapupMiles: string;
  dateStart: Date;
  dateEnd: Date;
  remark: string;
  createdAt: Date;
  updatedAt?: Date;
  maCar?: MaCarType[];
}
