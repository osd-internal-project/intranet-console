"use client";

import { useEffect } from "react";
import { ApiError } from "@/app/lib/axios/error-interceptor";
import { notifyError } from "@/app/utils/message";

/**
 * ตาข่ายรองสุดท้ายสำหรับ promise ที่ reject แล้วไม่มีใคร catch
 *
 * service layer ถูกแก้ให้ throw error แทนการคืน [] เงียบๆ ระหว่างการทยอย migrate
 * ยังมี component บางตัวที่เรียก service โดยไม่มี try/catch — handler นี้ทำให้ผู้ใช้
 * เห็น error toast แทนที่จะเงียบไปเฉยๆ และช่วยให้เราหา call site ที่ตกหล่นได้จาก console
 */
export default function UnhandledRejectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      // สนใจเฉพาะ error ที่มาจาก API เท่านั้น เพื่อไม่ให้ toast เด้งจาก error อื่นที่ไม่เกี่ยวข้อง
      if (!(reason instanceof ApiError)) return;

      // ไม่ทราบว่าเป็นการกระทำใด จึงไม่ส่ง action key — helper จะใช้คำกลาง ๆ ให้
      notifyError(reason);
      // กัน error ซ้ำไม่ให้ Next.js overlay เด้งทับ toast ใน dev
      event.preventDefault();
    };

    window.addEventListener("unhandledrejection", handleRejection);
    return () => window.removeEventListener("unhandledrejection", handleRejection);
  }, []);

  return <>{children}</>;
}
