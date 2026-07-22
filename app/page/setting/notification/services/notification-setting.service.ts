import { AxiosInstance } from "axios";
import {
  TNotificationSetting,
  TNotificationRecipient,
  TNotiCatalogItem,
} from "@/app/common/notification";

/** บริการฝั่งแอดมิน: ตั้งค่าประเภทการแจ้งเตือน + จัดการรายชื่อผู้รับ */
export const NotificationSettingServices = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/notification";
  return {
    /** catalog ประเภทการแจ้งเตือนทั้งหมด (label/category/target/threshold) */
    getCatalog: async (): Promise<TNotiCatalogItem[]> =>
      await axiosInstance
        .get(`${baseUrl}/catalog`)
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return [];
        }),

    /** ดึงการตั้งค่าทั้งหมด (สร้างค่าเริ่มต้นให้อัตโนมัติฝั่ง backend) */
    getSettings: async (): Promise<TNotificationSetting[]> =>
      await axiosInstance
        .get(`${baseUrl}/setting`)
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return [];
        }),

    /** อัปเดตการตั้งค่าของประเภทหนึ่ง */
    updateSetting: async (
      alertType: string,
      body: Partial<TNotificationSetting>,
    ) =>
      await axiosInstance
        .put(`${baseUrl}/setting/${alertType}`, body)
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return null;
        }),

    /** รายชื่อผู้รับ — ระบุ alertType เพื่อดูของประเภทนั้น (รวม global) */
    getRecipients: async (
      alertType?: string,
    ): Promise<TNotificationRecipient[]> =>
      await axiosInstance
        .get(`${baseUrl}/recipient`, {
          params: alertType ? { alertType } : undefined,
        })
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return [];
        }),

    /** เพิ่มผู้รับ (ระบุ alertType เพื่อผูกกับประเภท; ไม่ระบุ = global) */
    addRecipient: async (body: {
      userId: string;
      email: string;
      name?: string;
      alertType?: string;
    }) =>
      await axiosInstance
        .post(`${baseUrl}/recipient`, body)
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return null;
        }),

    /** ลบผู้รับ */
    removeRecipient: async (id: number) =>
      await axiosInstance
        .delete(`${baseUrl}/recipient/${id}`)
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return null;
        }),

    /** รันการแจ้งเตือนทันที (ทดสอบ) — force = ยิงทุกรายการปัจจุบันไม่สนใจ threshold */
    runNow: async (
      force = false,
    ): Promise<{ created: number; emailed: number } | null> =>
      await axiosInstance
        .post(`${baseUrl}/run-now`, null, { params: { force } })
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return null;
        }),
  };
};
