import { loadAppConfig } from "@/app/config/app-config";

/** โหมดการเสิร์ฟไฟล์ — inline สำหรับ preview/thumbnail, attachment สำหรับดาวน์โหลด */
export type MacarFileMode = "inline" | "attachment";

/**
 * สร้าง URL ไฟล์ของโมดูล macar ที่เสิร์ฟจาก MinIO ผ่าน /public/macar-file
 * @param key object key ใน MinIO (ค่า filePath ที่เก็บใน DB)
 * @param name ชื่อไฟล์เดิม (ใช้ตั้งชื่อตอนดาวน์โหลด)
 * @param mode inline (ค่าเริ่มต้น) หรือ attachment
 * @returns URL เต็ม หรือ "" เมื่อไม่มี key
 */
export const macarFileUrl = (
  key?: string | null,
  name?: string | null,
  mode: MacarFileMode = "inline",
): string => {
  if (!key) return "";
  const base = loadAppConfig().NEXT_PUBLIC_API_BASE_URL_INTRANET;
  const params = new URLSearchParams({ key, mode });
  if (name) params.set("name", name);
  return `${base}/public/macar-file?${params.toString()}`;
};

/** ตรวจว่าไฟล์เป็นรูปภาพจากนามสกุล เพื่อเลือกแสดง thumbnail หรือไอคอนไฟล์ */
export const isImageFile = (fileName?: string | null): boolean =>
  !!fileName && /\.(png|jpe?g|gif|webp)$/i.test(fileName);
