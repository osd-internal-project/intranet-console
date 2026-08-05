import { AxiosError, AxiosInstance } from "axios";

/**
 * Error ที่ถูก normalise แล้วจาก axios
 * เก็บ HTTP status และข้อความจริงจาก backend ไว้ให้ component ใช้แสดงผลได้
 */
export class ApiError extends Error {
  readonly status?: number;
  readonly payload?: unknown;

  constructor(message: string, status?: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

/** ข้อความ error กลางเมื่อ backend ไม่ได้ส่งข้อความที่อ่านรู้เรื่องกลับมา */
const FALLBACK_MESSAGE = "ไม่สามารถเชื่อมต่อระบบได้ กรุณาลองใหม่อีกครั้ง";

/**
 * ดึงข้อความ error ที่อ่านรู้เรื่องออกจาก response body ของ NestJS
 * NestJS ส่งกลับมาในรูป { statusCode, message, error } โดย message เป็น string หรือ string[]
 * @param data body ที่ได้จาก error response
 * @returns ข้อความ error หรือ undefined ถ้าหาไม่เจอ
 */
function extractServerMessage(data: unknown): string | undefined {
  if (typeof data === "string" && data.trim()) return data;
  if (!data || typeof data !== "object") return undefined;

  const message = (data as { message?: unknown }).message;
  if (typeof message === "string" && message.trim()) return message;
  if (Array.isArray(message) && message.length > 0) {
    return message.filter((m) => typeof m === "string").join(", ") || undefined;
  }

  const error = (data as { error?: unknown }).error;
  return typeof error === "string" && error.trim() ? error : undefined;
}

/**
 * ติด response interceptor ให้ axios instance เพื่อแปลง AxiosError เป็น ApiError
 * ไม่แตะ response ที่สำเร็จ — ทำงานเฉพาะตอน request ล้มเหลว
 * @param instance axios instance ที่ต้องการติด interceptor
 * @returns instance เดิม (เพื่อให้ chain ต่อได้)
 */
export function attachApiErrorInterceptor(instance: AxiosInstance): AxiosInstance {
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const status = error.response?.status;
      const message =
        extractServerMessage(error.response?.data) ?? error.message ?? FALLBACK_MESSAGE;
      return Promise.reject(new ApiError(message, status, error.response?.data));
    },
  );
  return instance;
}
