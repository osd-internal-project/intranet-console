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
