export interface typeGHS {
  id: number;
  ghsId: string;
  nameGhs: string;
  status: boolean;
  detail?: string;
  createdAt?: Date;
  updatedAt?: Date;
  imagesGhs?: string[];
}

export interface typeImagetoEdit {
  id: number;
  ghsId: string;
  nameGhs?: string;
  status?: boolean;
  detail?: string;
  createdAt?: Date;
  updatedAt?: Date;
  imagesGhs?: string[];
  imagefile?: Blob;
}

export interface typeGHSfilters {
  id: number;
  ghsId: string;
  nameGhs: string;
  status: boolean;
  detail?: string;
  createdAt?: Date[];
  updatedAt?: Date;
  imagesGhs?: string[];
}
