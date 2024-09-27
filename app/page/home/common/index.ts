export interface SlideImageType {
  id: number;
  fileId: string;
  filePath?: string;
  fileName?: string;
  fileType?: string;
  status: boolean;
  createdAt: Date;
  createdById?: string;
  createdByName?: string;
  updatedAt?: Date;
  updatedById?: string;
  updatedByName?: string;
  deletedAt?: Date;
}

export interface MasterRoomType {
  id: string;
  no: string;
  roomName: string;
  roomsStatus: boolean;
  roomDescription: string;
  bookingRoom: BookingRoomType[];
}

export interface BookingRoomType {
  roomId: string;
  roomName: String;
  roomType: String;
  bookerName: String;
  bookerPhone: String;
  bookerDepartment: String;
  positionName: String;
  bookingStatus: String;
  startDate: String;
  endDate: String;
  approveDate: string;
  title: String;
  member: String;
  approver: string;
  outSider: String;
  note: String;
}

export interface HandbookFileType {
  handbookid: number;
  fileName?: string;
  filetype?: string;
  fileLocation?: string;
  author?: string;
  createdAt?: Date;
  updatedAt?: Date;
  status?: boolean;
  idbook?: number;
}

export interface HandbookType {
  id: number;
  idbook: number;
  handbookid: number;
  fileName: string;
  filetype?: string;
  createdAt?: Date;
  updatedAt?: Date;
  author?: string;
  status?: boolean;
  handbookFile: HandbookFileType[];
}

export interface InformationNewsType {
  newsId: number;
  newsName?: string;
  content?: string;
  newsType?: string;
  author?: string;
  phblishedAt?: Date;
  updatedAt?: Date;
  status?: boolean;
  newsImage: NewsImageType[];
}

export interface NewsImageType {
  imageId: Number;
  newsId: Number;
  createdAt: String;
  updatedAt: String;
  fileimageName: String;
  fileimagePath: String;
  fileName: string;
}
