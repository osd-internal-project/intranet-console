"use client";
import React, { useContext, useState } from "react";
import { Button, Upload } from "antd";
import type { UploadFile } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { MaCarFile } from "../../../../common";
import MacarFileList from "../../../../common/macar-file-list";
import { ManageCarServices } from "../../../services/manage-car.service";
import { UserContext, UserContectType } from "@/app/config/userContext";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { loadAppConfig } from "@/app/config/app-config";
import { handleCompress } from "@/app/utils";
import { notifyError, notifySuccess } from "@/app/utils/message";

export interface CarFilesPanelProps {
  carId: string;
  /** ไฟล์แนบที่มาพร้อมข้อมูลรถ (car.maCarFiles) — ไม่ต้อง fetch แยก */
  files: MaCarFile[];
  /** เรียกหลังอัปโหลด/ลบสำเร็จ เพื่อให้หน้าแม่โหลดข้อมูลรถใหม่ */
  onChanged: () => Promise<void> | void;
}

/** จำนวนไฟล์สูงสุดต่อการอัปโหลด 1 ครั้ง — ตรงกับ FilesInterceptor('files', 10) ฝั่ง backend */
const MAX_FILES = 10;

/**
 * แท็บ "ไฟล์แนบ" ของหน้ารายละเอียดรถ — ดู/ดาวน์โหลดได้ทุกคน
 * อัปโหลดและลบเฉพาะผู้มีสิทธิ์ (admin / maUser)
 * @param carId รหัสรถ
 * @param files ไฟล์แนบปัจจุบันของรถ
 * @param onChanged callback ให้หน้าแม่ refresh หลังข้อมูลเปลี่ยน
 */
const CarFilesPanel: React.FC<CarFilesPanelProps> = ({
  carId,
  files,
  onChanged,
}): React.ReactElement => {
  const { id24Axios } = useId24();
  const baseUrIntranet = id24Axios(
    loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET,
  );
  const manageCarServices = ManageCarServices(baseUrIntranet);

  // context อาจเป็น null ตอน render นอก provider — ให้ accessRole คืน false ไว้ก่อน
  const { accessRole } = (useContext(UserContext) as UserContectType) || {
    accessRole: () => false,
  };
  /** สิทธิ์จัดการไฟล์ของโมดูล macar — เฉพาะ admin หรือ ma-user */
  const canManage = accessRole(["admin", "maUser"]);

  const [pendingFiles, setPendingFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);

  /** อัปโหลดไฟล์ที่เลือกไว้ทั้งหมดเป็น FormData ชุดเดียว แล้วให้หน้าแม่โหลดข้อมูลใหม่ */
  const handleUpload = async () => {
    if (pendingFiles.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      pendingFiles.forEach((file) => {
        formData.append("files", file.originFileObj as Blob);
      });
      await manageCarServices.uploadFilesDoc(carId, formData);
      notifySuccess("car.file.upload");
      setPendingFiles([]);
      await onChanged();
    } catch (error) {
      notifyError(error, "car.file.upload");
    } finally {
      setUploading(false);
    }
  };

  /** ลบไฟล์แนบ 1 รายการ (backend ลบ object ใน MinIO ให้ด้วย) */
  const handleDelete = async (id: number) => {
    try {
      await manageCarServices.deleteFileDoc(id);
      notifySuccess("car.file.delete");
      await onChanged();
    } catch (error) {
      notifyError(error, "car.file.delete");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {canManage && (
        <div className="flex flex-col gap-2 rounded-lg border border-dashed border-gray-300 p-3">
          <Upload
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            maxCount={MAX_FILES}
            fileList={pendingFiles}
            beforeUpload={async (file) => {
              const compressed = await handleCompress(file);
              // คืน false เพื่อไม่ให้ antd อัปโหลดเอง — ส่งเป็น FormData ทีเดียวตอนกดปุ่มอัปโหลด
              setPendingFiles((prev) => [
                ...prev,
                {
                  uid: file.uid,
                  name: file.name,
                  originFileObj: compressed,
                } as UploadFile,
              ]);
              return false;
            }}
            onRemove={(file) => {
              setPendingFiles((prev) =>
                prev.filter((item) => item.uid !== file.uid),
              );
            }}
          >
            <Button icon={<UploadOutlined />}>เลือกไฟล์</Button>
          </Upload>
          <div className="flex items-center gap-3">
            <Button
              type="primary"
              loading={uploading}
              disabled={pendingFiles.length === 0}
              onClick={handleUpload}
            >
              อัปโหลด
              {pendingFiles.length > 0 ? ` ${pendingFiles.length} ไฟล์` : ""}
            </Button>
            <span className="text-xs text-gray-400">
              รองรับ PDF และรูปภาพ (.pdf .jpg .png) สูงสุด {MAX_FILES} ไฟล์ต่อครั้ง
            </span>
          </div>
        </div>
      )}

      <MacarFileList
        items={files.map((file) => ({
          id: file.id,
          filePath: file.filePath,
          name: file.name ?? file.fileName,
          fileType: file.fileType,
        }))}
        onDelete={handleDelete}
        canDelete={canManage}
      />
    </div>
  );
};

export default CarFilesPanel;
