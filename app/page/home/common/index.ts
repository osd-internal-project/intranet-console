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
