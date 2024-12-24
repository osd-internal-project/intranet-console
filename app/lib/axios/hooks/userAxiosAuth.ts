"use client";

import {
  axiosUser,
  axiosReport,
  axiosStock,
  axiosIntranet,
  axiosCrm,
  axiosVender,
} from "../axios";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRefreshToken } from "./useRefreshToken";
import { message } from "antd";
import config from "@/app/config";
import { Session } from "next-auth";

export const useAxiosStock = () => {
  // let checkTokentime = "active";
  // const { data: session } = useSession();
  // useEffect(() => {
  //   const requestIntercept = axiosStock.interceptors.request.use(
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

  //   const responseIntercept = axiosStock.interceptors.response.use(
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
  //         return axiosStock(prevRequest);
  //       }

  //       Promise.reject(error);
  //     }
  //   );
  //   return () => {
  //     axiosStock.interceptors.request.eject(requestIntercept);
  //     axiosStock.interceptors.response.eject(responseIntercept);
  //   };
  // }, [session]);

  return axiosStock;
};

export const useAxiosReport = () => {
  // const { data: session } = useSession();
  // useEffect(() => {
  //   const requestIntercept = axiosReport.interceptors.request.use(
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
  //   const responseIntercept = axiosReport.interceptors.response.use(
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
  //         return axiosReport(prevRequest);
  //       }

  //       Promise.reject(error);
  //     }
  //   );
  //   return () => {
  //     axiosReport.interceptors.request.eject(requestIntercept);
  //     axiosReport.interceptors.response.eject(responseIntercept);
  //   };
  // }, [session]);

  return axiosReport;
};

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

export const useAxiosCrm = () => {
  // let checkTokentime = "active";
  // const { data: session } = useSession();
  // useEffect(() => {
  //   const requestIntercept = axiosCrm.interceptors.request.use(
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

  //   const responseIntercept = axiosCrm.interceptors.response.use(
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
  //         return axiosCrm(prevRequest);
  //       }

  //       Promise.reject(error);
  //     }
  //   );
  //   return () => {
  //     axiosCrm.interceptors.request.eject(requestIntercept);
  //     axiosCrm.interceptors.response.eject(responseIntercept);
  //   };
  // }, [session]);

  return axiosCrm;
};
export const useAxiosVender = () => {
  return axiosVender;
};
