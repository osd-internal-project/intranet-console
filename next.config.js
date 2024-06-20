/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    AUTH_SECRET_KEY: "n5yaP7ynm0Qf/JhIJVLXmfQH0zr+YgKwk0TdWo9EFwo=",
    ORGANIZED_ID: "9c41d38b-1f39-42b4-800f-7e719f8a988e",
    BACKEND_CRM_URL: "http://localhost:4005/api",
    BACKEND_INTRANET_URL: "http://192.168.31.181:8947/api",
    BACKEND_STOCK_URL: "http://192.168.31.181:8946/api",
    BACKEND_REPORT_URL: "http://192.168.31.181:8948/api",
    BACKEND_USER_URL: "http://192.168.31.181:8945/api",
    AUTH_BACKEND_URL: "http://192.168.31.181:8945/api",
    NEXTAUTH_URL: "http://192.168.31.181:8845",
  },
  reactStrictMode: false,
  output: "standalone",
};

// const nextConfig = {
//   env: {
//     AUTH_SECRET_KEY: "n5yaP7ynm0Qf/JhIJVLXmfQH0zr+YgKwk0TdWo9EFwo=",
//     ORGANIZED_ID: "9c41d38b-1f39-42b4-800f-7e719f8a988e",
//     BACKEND_CRM_URL: "http://localhost:4005/api",
//     BACKEND_INTRANET_URL: "http://192.168.31.180:8947/api",
//     BACKEND_STOCK_URL: "http://192.168.31.180:8946/api",
//     BACKEND_REPORT_URL: "http://192.168.31.180:8948/api",
//     BACKEND_USER_URL: "http://192.168.31.180:8945/api",
//     AUTH_BACKEND_URL: "http://192.168.31.180:8945/api",
//     NEXTAUTH_URL: "http://localhost:3000/",
//   },
//   reactStrictMode: false,
//   output: "standalone",
// };
module.exports = nextConfig;
