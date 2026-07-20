"use client";
import React from "react";
import { MaCarWrapupImage } from "./index";
import MacarFileList from "./macar-file-list";

export interface WrapupImageListProps {
  images?: MaCarWrapupImage[];
  /** ถ้ามี = แสดงปุ่มลบ (ต้องคู่กับ canDelete); เรียกเมื่อยืนยันลบ (ส่ง idwarpupImage) */
  onDelete?: (idwarpupImage: number) => void;
  /** สิทธิ์ลบ — ปุ่มลบจะแสดงเมื่อ true เท่านั้น */
  canDelete?: boolean;
  emptyText?: string;
}

/**
 * รายการไฟล์แนบของการตรวจสภาพ (MinIO) — wrapper บาง ๆ ของ MacarFileList
 * map ฟิลด์ของ maCarWrapupImage (fileName/filePath/idwarpupImage) เข้า MacarFileList
 */
const WrapupImageList: React.FC<WrapupImageListProps> = ({
  images,
  onDelete,
  canDelete = false,
  emptyText,
}): React.ReactElement => (
  <MacarFileList
    items={(images ?? []).map((image) => ({
      id: image.idwarpupImage as number,
      filePath: image.filePath,
      name: image.fileName,
      fileType: image.fileType,
    }))}
    onDelete={onDelete}
    canDelete={canDelete}
    emptyText={emptyText}
  />
);

export default WrapupImageList;
