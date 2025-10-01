import { Dayjs } from "dayjs";

export interface BookingType {
  id: string;
  bookingId: number;
  roomName: string;
  roomType: string;
  bookerName: string;
  bookerPhone: string;
  bookerDepartment: string;
  bookingStatus: string;
  startDate: Dayjs;
  endDate: Dayjs;
  title: string;
  member: string;
  outSider: string;
  note: string;
  guest: string;
  officer?: any; details: string
}

export interface MasterRoomType {
  roomName: string;
  roomDescription: string;
  masterRoomTypeId: number;
}
