"use client";

import axios from "@/app/lib/axios/axios";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

export const useRefreshToken = () => {
  // const { data: session } = useSession();

  const refreshToken = async (session: Session) => {
    if (session) {
      const res = await axios.post(`${process.env.BACKEND_USER_URL}/auth/refresh`, {
        refreshToken: session.refreshToken,
      });
      session.accessToken = res.data.accessToken;
      session.refreshToken = res.data.refreshToken;
    }
  };

  return refreshToken;
};
