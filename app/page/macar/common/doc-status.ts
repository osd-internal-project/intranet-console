import dayjs from "dayjs";
import { DocStatusLevel, DocType } from "./index";

/** จำนวนวันก่อนหมดอายุที่ถือว่า "ใกล้หมดอายุ" — ต้องตรงกับ WARNING_DAYS ฝั่ง backend */
export const WARNING_DAYS = 30;

/** ชื่อไทยของเอกสารแต่ละประเภท ใช้ทุกที่ที่ต้องแสดงชื่อ จะได้ไม่พิมพ์ไม่ตรงกัน */
export const DOC_TYPE_LABEL: Record<DocType, string> = {
  insurance: "ประกันภัย",
  act: "พ.ร.บ.",
  tax: "ภาษีรถยนต์",
};

export const DOC_TYPES: readonly DocType[] = ["insurance", "act", "tax"] as const;

/** สถานะเอกสารในรูปแบบที่พร้อมแสดงผล */
export interface DocStatusView {
  level: DocStatusLevel;
  /** ค่าสีของ antd Tag */
  tagColor: string;
  /** ข้อความบอกจำนวนวัน เช่น "เหลืออีก 12 วัน" */
  label: string;
  daysLeft: number | null;
}

/**
 * จำนวนวันที่เหลือก่อนหมดอายุ (ติดลบ = เกินกำหนดแล้ว)
 * ตัดเวลาออกก่อนเทียบ เอกสารที่หมดอายุวันนี้จึงได้ 0 ไม่ใช่ -1 เพราะเศษชั่วโมง
 */
export const daysUntil = (expireDate?: string | Date | null): number | null => {
  if (!expireDate) return null;
  return dayjs(expireDate).startOf("day").diff(dayjs().startOf("day"), "day");
};

/**
 * แปลงวันหมดอายุเป็นสถานะพร้อมสีและข้อความ
 *
 * backend ส่ง level มาให้อยู่แล้ว ฟังก์ชันนี้จึงคำนวณซ้ำเฉพาะตอนที่ยังไม่มีข้อมูลจาก server
 * (เช่น preview ในฟอร์มตอนผู้ใช้เพิ่งเลือกวันที่) — นิยาม "หมดอายุ" ต้องตรงกันทั้งสองฝั่ง
 *
 * @param expireDate วันหมดอายุของเอกสาร (undefined/null = ยังไม่มีเอกสาร)
 * @returns สถานะ + สี + ข้อความภาษาไทย
 */
export const getDocStatus = (expireDate?: string | Date | null): DocStatusView => {
  const days = daysUntil(expireDate);

  if (days === null) {
    return { level: "none", tagColor: "default", label: "ยังไม่มีข้อมูล", daysLeft: null };
  }
  if (days < 0) {
    return {
      level: "expired",
      tagColor: "red",
      label: `เกินกำหนด ${Math.abs(days)} วัน`,
      daysLeft: days,
    };
  }
  if (days === 0) {
    return { level: "warning", tagColor: "orange", label: "หมดอายุวันนี้", daysLeft: 0 };
  }
  if (days <= WARNING_DAYS) {
    return {
      level: "warning",
      tagColor: "orange",
      label: `เหลืออีก ${days} วัน`,
      daysLeft: days,
    };
  }
  return { level: "ok", tagColor: "green", label: `เหลืออีก ${days} วัน`, daysLeft: days };
};

/** สีของแต่ละ level ใช้กับ Tag ที่ได้ level มาจาก backend แล้ว ไม่ต้องคำนวณวันซ้ำ */
export const LEVEL_TAG_COLOR: Record<DocStatusLevel, string> = {
  expired: "red",
  warning: "orange",
  ok: "green",
  none: "default",
};
