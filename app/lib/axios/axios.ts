import config from "@/app/config";
import axios from "axios";

export default axios.create({
  baseURL: config.backendStockUrl,
  headers: { "Content-Type": "application/json" },
});

export const axiosStock = axios.create({
  baseURL: config.backendStockUrl,
  headers: { "Content-Type": "application/json" },
});
export const axiosReport = axios.create({
  baseURL: config.backendReportUrl,
  headers: { "Content-Type": "application/json" },
});
export const axiosUser = axios.create({
  baseURL: config.backendUserUrl,
  headers: { "Content-Type": "application/json" },
});
export const axiosIntranet = axios.create({
  baseURL: config.backendIntranetUrl,
  headers: { "Content-Type": "application/json" },
});
export const axiosVender = axios.create({
  baseURL: config.backendVendertUrl,
  headers: { "Content-Type": "application/json" },
});

export const axiosCrm = axios.create({
  baseURL: config.backendCrmUrl,
  headers: { "Content-Type": "application/json" },
});
