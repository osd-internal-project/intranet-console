import { AxiosInstance } from "axios";
import { TTestTemplateMeta } from "@/app/common/notification";

/** เส้นทาง endpoint ของแต่ละ service (โครงสร้าง path ต่างกัน) */
type TestMailPaths = {
  list: string; //GET รายการ template
  send: string; //POST ยิงทดสอบ
};

/** ผลลัพธ์การยิงทดสอบ — ok=false พร้อมข้อความ error เพื่อโชว์บน UI */
export type TestSendResult = { ok: true } | { ok: false; error: string };

/**
 * บริการทดสอบส่งอีเมล — ใช้ได้ทั้ง service notification และ intranet
 * โดยส่ง axios instance (ผูก base URL ของ service นั้น) + เส้นทาง endpoint เข้ามา
 */
export const TestMailServices = (
  axiosInstance: AxiosInstance,
  paths: TestMailPaths,
) => ({
  /** ดึงรายการ template ที่ทดสอบส่งได้ (ล้มเหลว → คืน [] เพื่อไม่ให้ทั้งหน้าพัง) */
  getTemplates: async (): Promise<TTestTemplateMeta[]> =>
    await axiosInstance
      .get(paths.list)
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
        return [];
      }),

  /** ยิงอีเมลทดสอบ 1 ฉบับ — คืนสถานะสำเร็จ/ล้มเหลวพร้อมข้อความ */
  sendTest: async (body: {
    key: string;
    to: string;
    data: Record<string, unknown>;
  }): Promise<TestSendResult> =>
    await axiosInstance
      .post(paths.send, body)
      .then(() => ({ ok: true }) as TestSendResult),
});
