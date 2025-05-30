"use client";

import { axiosUser } from "@/app/lib/axios/axios";
import { Session } from "next-auth";

export const useRefreshToken = () => {
  const refreshToken = async (session: Session) => {
    if (session) {
      const res = await axiosUser.post(`${process.env.BACKEND_USER_URL}/auth/refresh`, {
        refreshToken: session.refreshToken,
      });
      session.accessToken = res.data.accessToken;
      session.refreshToken = res.data.refreshToken;
    }
  };

  return refreshToken;
};
