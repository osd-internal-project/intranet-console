"use client";
import React, { useContext, useEffect, useState } from "react";

import MacarFileList from "./macar-file-list";
import { UserContectType, UserContext } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { MaCarBookServices } from "@/app/services/ma-car-book.service";

import { notifyError, notifySuccess } from "@/app/utils/message";
/** รูป 1 รายการของการจอง (maCarBookImage) */
interface BookImage {
  idCarBookImage: number;
  filePath?: string;
  fileName?: string;
}

export interface BookImageListProps {
  images?: BookImage[];
  emptyText?: string;
}

/**
 * รายการรูปการรับ-คืนรถ (MinIO) — self-contained: ดึงสิทธิ์ลบจาก UserContext,
 * แสดง thumbnail/ดาวน์โหลด และลบได้ (เฉพาะ admin/ma-user) โดยอัปเดตลิสต์ในตัวเองทันที
 */
const BookImageList: React.FC<BookImageListProps> = ({
  images,
  emptyText,
}): React.ReactElement => {
  const { accessRole } = (useContext(UserContext) as UserContectType) || {
    accessRole: () => false,
  };
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(
    loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET,
  );

  const [list, setList] = useState<BookImage[]>(images ?? []);
  useEffect(() => {
    setList(images ?? []);
  }, [images]);

  // สิทธิ์ลบไฟล์ของโมดูล macar — เฉพาะ admin หรือ ma-user
  const canDelete = accessRole(["admin", "maUser"]);

  /** ลบรูป 1 รายการ แล้วเอาออกจากลิสต์ทันที */
  const handleDelete = async (idCarBookImage: number) => {
    const result =
      await MaCarBookServices(baseUrIntranet).deleteMaCarBookingImage(
        idCarBookImage,
      );
    if (result === null) {
      notifyError(undefined, "car.image.delete");
      return;
    }
    setList((prev) =>
      prev.filter((item) => item.idCarBookImage !== idCarBookImage),
    );
    notifySuccess("car.image.delete");
  };

  return (
    <MacarFileList
      items={list.map((image) => ({
        id: image.idCarBookImage,
        filePath: image.filePath,
        name: image.fileName,
      }))}
      onDelete={handleDelete}
      canDelete={canDelete}
      emptyText={emptyText}
    />
  );
};

export default BookImageList;
