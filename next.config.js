/** @type {import('next').NextConfig} */

// server name domain on prd Chemsubstant
// const nextConfig = {
//   env: {
//     AUTH_SECRET_KEY: "n5yaP7ynm0Qf/JhIJVLXmfQH0zr+YgKwk0TdWo9EFwo=",
//     ORGANIZED_ID: "9c41d38b-1f39-42b4-800f-7e719f8a988e",
//     BACKEND_STOCK_URL: "http://chemsubstant.dss.local/public/api/stock",
//     BACKEND_REPORT_URL: "http://chemsubstant.dss.local/public/api/report",
//     BACKEND_USER_URL: "http://chemsubstant.dss.local/public/api/user",
//     AUTH_BACKEND_URL: "http://172.16.55.59:8824/api",
//     NEXTAUTH_URL: "http://chemsubstant.dss.local/",
//   },
//   reactStrictMode: false,
//   output: "standalone",
// };

// server prd
// const nextConfig = {
//   env: {
//     AUTH_SECRET_KEY: "n5yaP7ynm0Qf/JhIJVLXmfQH0zr+YgKwk0TdWo9EFwo=",
//     ORGANIZED_ID: "9c41d38b-1f39-42b4-800f-7e719f8a988e",
//     BACKEND_STOCK_URL: "http://172.16.55.58:8081/public/api/stock",
//     BACKEND_REPORT_URL: "http://172.16.55.58:8081/public/api/report",
//     BACKEND_USER_URL: "http://172.16.55.58:8081/public/api/user",
//     AUTH_BACKEND_URL: "http://172.16.55.59:8824/api",
//     NEXTAUTH_URL: "http://172.16.55.58:8081/",
//   },
//   reactStrictMode: false,
//   output: "standalone",
// };

// server lab
// const nextConfig = {
//   env: {
//     AUTH_SECRET_KEY: "n5yaP7ynm0Qf/JhIJVLXmfQH0zr+YgKwk0TdWo9EFwo=",
//     ORGANIZED_ID: "9c41d38b-1f39-42b4-800f-7e719f8a988e",
//     BACKEND_STOCK_URL: "http://192.168.31.180:8081/public/api/stock",
//     BACKEND_REPORT_URL: "http://192.168.31.180:8081/public/api/report",
//     BACKEND_USER_URL: "http://192.168.31.180:8081/public/api/user",
//     AUTH_BACKEND_URL: "http://192.168.31.181:8824/api",
//     NEXTAUTH_URL: "http://192.168.31.180:8081/",
//   },
//   reactStrictMode: false,
//   output: "standalone",
// };

// run service be
const nextConfig = {
  env: {
    AUTH_SECRET_KEY: "n5yaP7ynm0Qf/JhIJVLXmfQH0zr+YgKwk0TdWo9EFwo=",
    ORGANIZED_ID: "9c41d38b-1f39-42b4-800f-7e719f8a988e",
    BACKEND_STOCK_URL: "http://localhost:4001/api",
    BACKEND_REPORT_URL: "http://localhost:4002/api",
    BACKEND_USER_URL: "http://localhost:4003/api",
    AUTH_BACKEND_URL: "http://localhost:4003/api",

    NEXTAUTH_URL: "http://localhost:3000/",
  },
  reactStrictMode: false,
  output: "standalone",
};

module.exports = nextConfig;
