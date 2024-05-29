"use client";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
export function createCookieLocal(name: string, value: string) {
  if (getCookie(name)) {
    deleteCookie(name);
  }

  setCookie(name, value, { maxAge: 30 * 24 * 60 * 60, path: "/signin" });
}

export function getCookieLocal(name: string) {
  const cookie = getCookie(name);
  if (!cookie) {
    return null;
  }
  return cookie;
}

// export async function createCookie(name: string, value: string) {
//   cookies().set({
//     name: "name",
//     value: "lee",
//     path: "/",
//   });
// }
// export async function getCookie(name: string) {
//   const cookieStore = cookies();
//   const theme = cookieStore.get(name);
//   return theme;
// }
