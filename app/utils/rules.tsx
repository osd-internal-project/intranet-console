"use client";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { useSession } from "next-auth/react";
export function createCookieLocal(name: string, value: string) {
  if (getCookie(name)) {
    deleteCookie(name);
  }

  setCookie(name, value, { maxAge: 30 * 24 * 60 * 60, path: "/signin" });
}

export const checkRule = (keyword: string) => {
  const { data: session } = useSession();
  if (session) {
    return session?.rulelist.includes(keyword);
  } else {
    return false;
  }
};
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
