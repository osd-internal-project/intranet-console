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
  maCarFiles: MaCarFile[];

  fuelCardStatus?: "active" | "inactive";
  fuelCardNumber?: string;
  fuelCardExpiredDate?: Date;
  fuelMonthlyLimit?: number;
  fuelMonthlyRemaining?: number;
  fuelResetDayOfMonth?: number;
}

export interface MaCarFuelTransactionType {
  id: number;
  carId: string;
  date: Date;
  amount: number;
  remaining: number;
  description?: string;
  actionStatus: "use" | "adjust" | "reset";
}
export interface MaCarFile {
  id: number;
  fileName?: string;
  fileType?: string;
  filePath?: string;
  createdAt: string;
  updatedAt?: string;
  carId?: string;
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
  carSelected: string;
  idProvinces: string;
  remarkApproved: string;
  remarkCancel: string;
  // docs: dataMaCarbook[];
}

export interface dataMaCarbook {
  docs: MaCarBookType[];
  total: number;
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
  status: null;
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
  createbyName?: string;
  maCar?: MaCarType[];
}
export interface MaCarWrapupImage {
  idwarpupImage?: number;
  maName: String;
  mafileNameImage: String;
  mafilePart: String;
  createdAt: String;
  updatedAt: String;
  carWrapupId: string;
}

export interface ProvincesType {
  id: number;
  provinceId: string;
  nameProvinceTH: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type ITPagination = {
  current: number;
  pageSize: number;
  total?: number;
};

export interface MaCarType {
  id: number;
  typeName: string;
  detail: string;
  status: boolean;
  createdAt: Date;
  createdById: string;
  createdByName: string;
  remark?: string;
}
