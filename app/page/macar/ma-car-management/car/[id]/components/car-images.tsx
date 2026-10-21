"use client";
import React, { useContext, useState } from "react";
import { Button, Image, Popconfirm, Upload } from "antd";
import type { RcFile } from "antd/es/upload";
import { CarOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { MaCarImage } from "../../../../common";
import { macarFileUrl } from "../../../../common/macar-file";
import { ManageCarServices } from "../../../services/manage-car.service";
import { UserContext, UserContectType } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { handleCompress } from "@/app/utils";
import { notifyError, notifySuccess } from "@/app/utils/message";

type ImageType = MaCarImage["type"];

/** service + สิทธิ์จัดการรูปรถ (admin / maUser เหมือนไฟล์แนบ) ใช้ร่วมกันทั้ง profile และ gallery */
const useCarImageActions = (carId: string, onChanged: () => void) => {
  const { id24Axios } = useId24();
  const manageCarServices = ManageCarServices(
    id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET),
  );
  // context อาจเป็น null ตอน render นอก provider — ให้ accessRole คืน false ไว้ก่อน
  const { accessRole } = (useContext(UserContext) as UserContectType) || {
    accessRole: () => false,
  };
  const canManage = accessRole(["admin", "maUser"]);
  const [uploading, setUploading] = useState<boolean>(false);

  const upload = async (type: ImageType, files: RcFile[]) => {
    setUploading(true);
    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append("files", await handleCompress(file));
      }
      await manageCarServices.uploadCarImages(carId, type, formData);
      notifySuccess("car.image.upload");
      onChanged();
    } catch (error) {
      notifyError(error, "car.image.upload");
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id: number) => {
    try {
      await manageCarServices.deleteCarImage(id);
      notifySuccess("car.image.delete");
      onChanged();
    } catch (error) {
      notifyError(error, "car.image.delete");
    }
  };

  return { canManage, uploading, upload, remove };
};

const imageSrc = (image: MaCarImage) =>
  macarFileUrl(image.filePath, image.name);

export interface CarImagesProps {
  carId: string;
  images: MaCarImage[];
  /** เรียกหลังอัปโหลด/ลบสำเร็จ เพื่อให้หน้าแม่โหลดข้อมูลรถใหม่ */
  onChanged: () => void;
}

/** รูป profile ของรถ (4:3) — ไม่มีรูปแสดงไอคอนรถ, ผู้มีสิทธิ์เพิ่ม/เปลี่ยนรูปได้ */
export const CarProfileImage: React.FC<CarImagesProps> = ({
  carId,
  images,
  onChanged,
}) => {
  const { canManage, uploading, upload } = useCarImageActions(carId, onChanged);
  const profile = images.find((image) => image.type === "profile");

  return (
    <div className="flex w-40 shrink-0 flex-col gap-1.5">
      <div className="aspect-[4/3] w-40 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
        {profile ? (
          <Image
            src={imageSrc(profile)}
            alt="รูปรถ"
            width="100%"
            height="100%"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-gray-300">
            <CarOutlined />
          </div>
        )}
      </div>
      {canManage && (
        <Upload
          accept="image/*"
          showUploadList={false}
          beforeUpload={(file) => {
            void upload("profile", [file]);
            // คืน false เพื่อไม่ให้ antd อัปโหลดเอง
            return false;
          }}
        >
          <Button
            size="small"
            type="link"
            loading={uploading}
            className="!px-0"
          >
            {profile ? "เปลี่ยนรูป" : "เพิ่มรูปรถ"}
          </Button>
        </Upload>
      )}
    </div>
  );
};

/** แถบรูปรายละเอียดรถ — คลิกรูปเพื่อดูแบบเต็ม, ผู้มีสิทธิ์เพิ่ม/ลบได้ */
export const CarGalleryStrip: React.FC<CarImagesProps> = ({
  carId,
  images,
  onChanged,
}) => {
  const { canManage, uploading, upload, remove } = useCarImageActions(
    carId,
    onChanged,
  );
  const gallery = images.filter((image) => image.type === "gallery");

  if (!canManage && gallery.length === 0) return null;

  return (
    <div className="mb-3">
      <div className="mb-1.5 text-xs text-gray-400">
        รูปรายละเอียด ({gallery.length})
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <Image.PreviewGroup>
          {gallery.map((image) => (
            <div
              key={image.id}
              className="group relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-md border border-gray-200"
            >
              <Image
                src={imageSrc(image)}
                alt={image.name ?? "รูปรถ"}
                width={72}
                height={72}
                className="object-cover"
              />
              {canManage && (
                <Popconfirm
                  title="ลบรูปนี้?"
                  okText="ลบ"
                  cancelText="ยกเลิก"
                  onConfirm={() => remove(image.id)}
                >
                  <button
                    type="button"
                    aria-label="ลบรูป"
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded bg-white/90 text-xs text-red-500 opacity-0 shadow-sm transition-opacity focus:opacity-100 group-hover:opacity-100"
                  >
                    <DeleteOutlined />
                  </button>
                </Popconfirm>
              )}
            </div>
          ))}
        </Image.PreviewGroup>
        {canManage && (
          <Upload
            accept="image/*"
            multiple
            showUploadList={false}
            beforeUpload={(file, fileList) => {
              // antd เรียกทีละไฟล์ — ส่งครั้งเดียวตอนไฟล์สุดท้ายของชุด
              if (file === fileList[fileList.length - 1]) {
                void upload("gallery", fileList.slice(0, 10));
              }
              return false;
            }}
          >
            <button
              type="button"
              disabled={uploading}
              className="flex h-[72px] w-[72px] shrink-0 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-gray-300 text-xs text-gray-400 hover:border-blue-400 hover:text-blue-500"
            >
              <PlusOutlined />
              {uploading ? "กำลังอัปโหลด" : "เพิ่มรูป"}
            </button>
          </Upload>
        )}
      </div>
    </div>
  );
};
