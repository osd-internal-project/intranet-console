import config from "@/app/config";
import axios from "axios";
import { attachApiErrorInterceptor } from "./error-interceptor";

export const axiosUser = attachApiErrorInterceptor(
  axios.create({
    baseURL: config.backendUserUrl,
    headers: { "Content-Type": "application/json" },
  }),
);

export const axiosIntranet = attachApiErrorInterceptor(
  axios.create({
    baseURL: config.backendIntranetUrl,
    headers: { "Content-Type": "application/json" },
  }),
);
