/** 1 รายการแจ้งเตือนในฟีด (เว็บ) */
export type TNotification = {
  id: number;
  userId: string;
  title: string;
  message: string;
  type: string; //insurance-expiry | ma-due
  refId?: string | null;
  carId?: string | null;
  path?: string | null;
  level?: string | null; //warning | expired
  isRead: boolean;
  createdAt: string;
};

/** กลยุทธ์การหาผู้รับ */
export type TNotiTarget = "REQUESTER" | "APPROVER" | "FIXED_LIST";

/** 1 ประเภทใน catalog (มาจาก backend GET /notification/catalog) */
export type TNotiCatalogItem = {
  key: string;
  label: string;
  category: string;
  defaultTarget: TNotiTarget;
  moduleCode?: string;
  hasThresholds?: boolean;
};

/** การตั้งค่าการแจ้งเตือนต่อ 1 ประเภท (แอดมิน) */
export type TNotificationSetting = {
  id: number;
  alertType: string; //key ใน catalog
  enabled: boolean;
  emailEnabled: boolean;
  webEnabled: boolean;
  targetStrategy: TNotiTarget;
  moduleCode?: string | null;
  thresholds: number[];
  notifyWhenExpiredDaily: boolean;
  updatedAt: string;
};

/** ผู้รับการแจ้งเตือน (แอดมินจัดการ) */
export type TNotificationRecipient = {
  id: number;
  userId: string;
  email: string;
  name?: string | null;
  alertType?: string | null;
  createdAt: string;
};
