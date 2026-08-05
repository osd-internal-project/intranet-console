import { AxiosInstance } from "axios";
import { TNotification } from "../common/notification";

/**
 * บริการฝั่งฟีดแจ้งเตือนรายผู้ใช้ (กระดิ่ง + หน้า list)
 * ยิงไปที่ notification service ผ่าน base URL ของตัวเอง
 */
export const NotificationServices = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/notification";
  return {
    /** รายการแจ้งเตือนของผู้ใช้ — unreadOnly = true เอาเฉพาะยังไม่อ่าน */
    getByUser: async (
      userId: string,
      unreadOnly = false,
    ): Promise<TNotification[]> =>
      await axiosInstance
        .get(`${baseUrl}/user/${userId}`, {
          params: unreadOnly ? { unread: "true" } : undefined,
        })
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return [];
        }),

    /** จำนวนที่ยังไม่อ่าน (badge) */
    getUnreadCount: async (userId: string): Promise<number> =>
      await axiosInstance
        .get(`${baseUrl}/user/${userId}/unread-count`)
        .then((res) => res.data?.count ?? 0)
        .catch((err) => {
          console.log(err);
          return 0;
        }),

    /** ทำเครื่องหมายอ่านแล้ว 1 รายการ */
    markRead: async (id: number) =>
      await axiosInstance
        .patch(`${baseUrl}/${id}/read`)
        .then((res) => res.data),

    /** ทำเครื่องหมายอ่านแล้วทั้งหมด */
    markAllRead: async (userId: string) =>
      await axiosInstance
        .patch(`${baseUrl}/user/${userId}/read-all`)
        .then((res) => res.data),
  };
};
