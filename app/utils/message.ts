import { message } from "antd";
import type { MessageType } from "antd/es/message/interface";
import { ApiError } from "@/app/lib/axios/error-interceptor";
import { ACTION_LABEL, ActionKey, NETWORK_ERROR, RETRY_HINT } from "@/app/config/messages";

/**
 * เติมคำว่า "สำเร็จ" / "ไม่สำเร็จ" ต่อท้าย label ของการกระทำ
 * แยกออกมาเพื่อให้รูปประโยคของทุก toast ในระบบเหมือนกัน
 * @param action key ของการกระทำใน ACTION_LABEL
 * @param ok true = สำเร็จ, false = ไม่สำเร็จ
 * @returns ข้อความภาษาไทย เช่น "จองรถสำเร็จ" หรือ "จองรถไม่สำเร็จ"
 */
function buildText(action: ActionKey | undefined, ok: boolean): string {
  // ไม่ระบุ action ใช้คำกลาง ๆ สำหรับกรณีที่ไม่ทราบบริบท (เช่น global handler)
  const label = action ? ACTION_LABEL[action] : "ดำเนินการ";
  return `${label}${ok ? "สำเร็จ" : "ไม่สำเร็จ"}`;
}

/**
 * ข้อความสำเร็จของการกระทำ — ใช้กับ UI ที่ไม่ใช่ antd message เช่น notification
 * @param action key ของการกระทำ
 * @returns ข้อความ เช่น "เพิ่มงานสำเร็จ"
 */
export function successText(action: ActionKey): string {
  return buildText(action, true);
}

/**
 * ข้อความไม่สำเร็จของการกระทำ ใช้กฎเดียวกับ notifyError (4xx เห็นรายละเอียด, 5xx ไม่เห็น)
 * @param error error ที่ได้จาก catch
 * @param action key ของการกระทำ
 * @returns ข้อความพร้อมแสดงผล
 */
export function errorText(error: unknown, action: ActionKey): string {
  const text = buildText(action, false);
  if (isUserFacingError(error)) return `${text}: ${error.message}`;
  console.error(`[${action}]`, error);
  const isNetwork = error instanceof ApiError && error.status === undefined;
  return `${text} ${isNetwork ? NETWORK_ERROR : RETRY_HINT}`;
}

/**
 * แจ้งเตือนเมื่อเรียก API สำเร็จ
 * @param action key ของการกระทำ เช่น "booking.car.create"
 * @param detail ข้อความเสริมที่ต้องการต่อท้าย (ถ้ามี) เช่น จำนวนรายการที่ทำสำเร็จ
 * @returns handle ของ antd message (thenable — resolve เมื่อ toast ปิด) เพื่อให้ chain .then() ต่อได้
 */
export function notifySuccess(action: ActionKey, detail?: string): MessageType {
  const text = buildText(action, true);
  return message.success(detail ? `${text} ${detail}` : text);
}

/**
 * ตรวจว่า error นี้เป็นความผิดของฝั่งผู้ใช้ (4xx) หรือไม่
 * 4xx = ข้อมูลที่ส่งไปไม่ถูกต้อง ผู้ใช้แก้ไขเองได้ จึงควรเห็นข้อความจริงจาก backend
 * 5xx / ไม่มี status = ระบบขัดข้อง ไม่ควรเปิดเผยรายละเอียดภายในให้ผู้ใช้
 * @param error error ที่ได้จาก catch
 * @returns true เมื่อเป็น ApiError ที่มี status อยู่ในช่วง 4xx
 */
function isUserFacingError(error: unknown): error is ApiError {
  if (!(error instanceof ApiError)) return false;
  return typeof error.status === "number" && error.status >= 400 && error.status < 500;
}

/**
 * แจ้งเตือนเมื่อเรียก API ไม่สำเร็จ
 *
 * - 4xx  → "จองรถไม่สำเร็จ: <ข้อความจาก backend>" เพราะผู้ใช้แก้ไขข้อมูลเองได้
 * - 5xx / เชื่อมต่อไม่ได้ → "จองรถไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" และ log ต้นฉบับไว้ที่ console
 *   เพื่อไม่ให้ข้อความภายในระบบ (เช่น SQL/Prisma error) หลุดถึงผู้ใช้
 *
 * @param error error ที่ได้จาก catch (ปกติเป็น ApiError จาก axios interceptor)
 * @param action key ของการกระทำที่ล้มเหลว — ไม่ระบุได้เมื่อไม่ทราบบริบท
 * @returns handle ของ antd message (thenable) เพื่อให้ chain .then() ต่อได้
 */
export function notifyError(error: unknown, action?: ActionKey): MessageType {
  const text = buildText(action, false);

  if (isUserFacingError(error)) {
    return message.error(`${text}: ${error.message}`);
  }

  // ระบบขัดข้อง — เก็บรายละเอียดจริงไว้ที่ console สำหรับ dev เท่านั้น
  console.error(`[${action ?? "unknown"}]`, error);
  const isNetwork = error instanceof ApiError && error.status === undefined;
  return message.error(`${text} ${isNetwork ? NETWORK_ERROR : RETRY_HINT}`);
}
