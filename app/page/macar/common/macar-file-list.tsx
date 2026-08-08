"use client";
import React from "react";
import { Button, Image, Popconfirm, Tooltip } from "antd";
import {
  DeleteOutlined,
  DownloadOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { isImageFile, macarFileUrl } from "./macar-file";

/** ไฟล์ 1 รายการแบบ normalize สำหรับแสดงในลิสต์ (ใช้ได้กับทุกโมดูล macar) */
export interface MacarFileItem {
  id: number;
  /** object key ใน MinIO หรือ path เดิม (ไฟล์เก่า) */
  filePath?: string | null;
  /** ชื่อไฟล์ที่แสดง/ตั้งชื่อตอนดาวน์โหลด */
  name?: string | null;
  fileType?: string | null;
}

export interface MacarFileListProps {
  items: MacarFileItem[];
  /** ถ้ามี = แสดงปุ่มลบ (ต้องคู่กับ canDelete); เรียกเมื่อยืนยันลบ */
  onDelete?: (id: number) => void;
  /** สิทธิ์ลบ — ปุ่มลบจะแสดงเมื่อ true เท่านั้น */
  canDelete?: boolean;
  emptyText?: string;
}

/**
 * รายการไฟล์แนบของโมดูล macar (MinIO) — thumbnail สำหรับรูป / ไอคอนสำหรับไฟล์อื่น
 * พร้อมชื่อไฟล์ ปุ่มดาวน์โหลด และปุ่มลบ (เมื่อ onDelete && canDelete)
 */
const MacarFileList: React.FC<MacarFileListProps> = ({
  items,
  onDelete,
  canDelete = false,
  emptyText = "ไม่มีไฟล์แนบ",
}): React.ReactElement => {
  if (!items || items.length === 0) {
    return <div className="py-2 text-sm text-gray-400">{emptyText}</div>;
  }
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, index) => {
        const inlineUrl = macarFileUrl(item.filePath, item.name, "inline");
        console.log("inlineUrl", inlineUrl, item.filePath, item.name);
        const downloadUrl = macarFileUrl(
          item.filePath,
          item.name,
          "attachment",
        );
        const isImage = isImageFile(item.name) || isImageFile(item.filePath);
        return (
          <div
            key={item.id ?? index}
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-2 transition-colors hover:border-blue-300"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100">
              {isImage ? (
                <Image
                  src={inlineUrl}
                  alt={item.name ?? "image"}
                  width={48}
                  height={48}
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <FileOutlined className="text-xl text-gray-400" />
              )}
            </div>
            <span className="min-w-0 flex-1 truncate text-sm text-gray-700">
              {item.name || "ไฟล์แนบ"}
            </span>
            <Tooltip title="ดาวน์โหลด">
              <Button
                type="text"
                size="small"
                icon={<DownloadOutlined />}
                href={downloadUrl}
                target="_blank"
              />
            </Tooltip>
            {onDelete && canDelete && item.id !== undefined && (
              <Popconfirm
                title="ลบไฟล์นี้?"
                okText="ลบ"
                cancelText="ยกเลิก"
                onConfirm={() => onDelete(item.id)}
              >
                <Tooltip title="ลบ">
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                  />
                </Tooltip>
              </Popconfirm>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MacarFileList;
