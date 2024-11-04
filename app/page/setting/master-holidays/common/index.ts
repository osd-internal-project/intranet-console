// YEAR
export interface ICreateMasterHolidayYearDto {
  holidaysDate: Date | string;
  holidaysYear: string;
}
export interface IFindAllYearDto {
  id: number;
  holidaysYear: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}
export interface IManagePageYear {
  statusModal: boolean;
  statusAction?: "create" | "update";
}

// DAY
export interface ICreateMasterHolidayDto {
  holidaysName: string;
  holidaysDate: Date | string;
  holidaysYear: string;
}
export interface IFindAllDayDto {
  id: number;
  holidaysName: string;
  masterHolidaysYearId: number;
  holidaysDate: string;
  createdAt: string;
  updatedAt: string;
}
export interface IManagePageDay {
  statusModal: boolean;
  statusAction?: "create" | "update";
}
