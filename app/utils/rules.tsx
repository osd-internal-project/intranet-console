"use client";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
export function createCookieLocal(name: string, value: string) {
  if (getCookie(name)) {
    deleteCookie(name);
  }

  setCookie(name, value, { maxAge: 30 * 24 * 60 * 60, path: "/signin" });
}

export const checkRule = (keyword: string) => {
  return false;
};
