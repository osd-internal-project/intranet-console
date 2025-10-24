"use client";

import { axiosUser, axiosIntranet } from "../axios";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { message } from "antd";
import config from "@/app/config";
import { Session } from "next-auth";

export const useAxiosUser = () => {
  // const { data: session } = useSession();
  // useEffect(() => {
  //   const requestIntercept = axiosUser.interceptors.request.use(
  //     (config) => {
  //       if (!config.headers["Authorization"]) {
  //         config.headers["Authorization"] = `Bearer ${session?.accessToken}`;
  //       }
  //       return config;
  //     },
  //     (error) => {
  //       Promise.reject(error);
  //     }
  //   );
  //   const responseIntercept = axiosUser.interceptors.response.use(
  //     (response) => response,
  //     async (error) => {
  //       const prevRequest = error.config;
  //       if (error.response.status === 403 && !prevRequest.sent) {
  //         prevRequest.sent = true;
  //         prevRequest.headers[
  //           "Authorization"
  //         ] = `Bearer ${session?.accessToken}`;
  //         message.error("หมดอายุการใช้งาน กรุณาเข้าสู่ระบบ");
  //         signOut();
  //         return axiosUser(prevRequest);
  //       }

  //       Promise.reject(error);
  //     }
  //   );
  //   return () => {
  //     axiosUser.interceptors.request.eject(requestIntercept);
  //     axiosUser.interceptors.response.eject(responseIntercept);
  //   };
  // }, [session]);

  return axiosUser;
};

export const useAxiosRefreshToken = (session: Session) => {
  // useEffect(() => {
  //   if (session) {
  //     const refreshToken = useRefreshToken();
  //     const renewTokenTask = setInterval(async () => {
  //       await refreshToken(session).catch(() => {
  //         message.error("หมดอายุการใช้งาน กรุณาเข้าสู่ระบบ");
  //         signOut();
  //       });
  //     }, 60 * 60 * 1000);
  //     return () => {
  //       clearInterval(renewTokenTask);
  //     };
  //   }
  // }, [session]);
};

export const useAxiosIntranet = () => {
  // let checkTokentime = "active";
  // const { data: session } = useSession();
  // useEffect(() => {
  //   const requestIntercept = axiosIntranet.interceptors.request.use(
  //     (config) => {
  //       if (!config.headers["Authorization"]) {
  //         config.headers["Authorization"] = `Bearer ${session?.accessToken}`;
  //       }
  //       return config;
  //     },
  //     (error) => {
  //       Promise.reject(error);
  //     }
  //   );

  //   const responseIntercept = axiosIntranet.interceptors.response.use(
  //     (response) => response,
  //     async (error) => {
  //       const prevRequest = error.config;
  //       if (error.response.status === 403 && !prevRequest.sent) {
  //         prevRequest.sent = true;
  //         prevRequest.headers[
  //           "Authorization"
  //         ] = `Bearer ${session?.accessToken}`;
  //         message.error("หมดอายุการใช้งาน กรุณาเข้าสู่ระบบ");
  //         signOut();
  //         return axiosIntranet(prevRequest);
  //       }

  //       Promise.reject(error);
  //     }
  //   );
  //   return () => {
  //     axiosIntranet.interceptors.request.eject(requestIntercept);
  //     axiosIntranet.interceptors.response.eject(responseIntercept);
  //   };
  // }, [session]);

  return axiosIntranet;
};
