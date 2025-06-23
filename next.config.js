/** @type {import('next').NextConfig} */

// domain server
// const nextConfig = {
//   env: {
//     AUTH_SECRET_KEY: "n5yaP7ynm0Qf/JhIJVLXmfQH0zr+YgKwk0TdWo9EFwo=",
//     ORGANIZED_ID: "9c41d38b-1f39-42b4-800f-7e719f8a988e",
//     REACT_APP_AUTH_URL: "https://id24-uat.osd.co.th",
//     REACT_APP_ID24_CLIENT_ID: "b7f34680-2d41-42a7-8e96-3752626c0054",
//     REACT_APP_CLIENT_ID: "b7f34680-2d41-42a7-8e96-3752626c0054",
//     REACT_APP_API_BASE_URL_INTRANET: "https://intra.osd.co.th/public/api/intranet",
//     REACT_APP_API_BASE_URL_USER: "https://intra.osd.co.th/public/api/user",
//     AUTH_BACKEND_URL: "https://intra.osd.co.th/public/api/user",
//     NEXTAUTH_URL: "https://intra.osd.co.th",
//     REACT_APP_USE_AUTH: "https://id24-uat.osd.co.th",
//     MOUNT_DIR: "services/intranet/src",
//   },
//   reactStrictMode: false,
//   output: "standalone",
// };

// const nextConfig = {
//   env: {
//     AUTH_SECRET_KEY: "n5yaP7ynm0Qf/JhIJVLXmfQH0zr+YgKwk0TdWo9EFwo=",
//     ORGANIZED_ID: "9c41d38b-1f39-42b4-800f-7e719f8a988e",
//     REACT_APP_AUTH_URL: "https://id24-uat.osd.co.th",
//     REACT_APP_ID24_CLIENT_ID: "b7f34680-2d41-42a7-8e96-3752626c0054",
//     REACT_APP_CLIENT_ID: "b7f34680-2d41-42a7-8e96-3752626c0054",
//     REACT_APP_API_BASE_URL_CRM: "http://intra.lextech.co.th/public/api/crm",
//     REACT_APP_API_BASE_URL_INTRANET: "http://intra.lextech.co.th/public/api/intranet",
//     REACT_APP_API_BASE_URL_USER: "http://intra.lextech.co.th/public/api/user",
//     AUTH_BACKEND_URL: "http://intra.lextech.co.th/public/api/user",
//     NEXTAUTH_URL: "http://intra.lextech.co.th",
//     REACT_APP_USE_AUTH: "https://id24-uat.osd.co.th",
//     MOUNT_DIR: "services/intranet/src",
//   },
//   reactStrictMode: false,
//   output: "standalone",
//   webpack: (config) => {
//     config.externals = [...config.externals, "jsdom", "canvas"];
//     config.module.rules.push({
//       test: /\.node/,
//       use: "raw-loader",
//     });
//     return config;
//   },
// };

// ip server
// const nextConfig = {
//   env: {
//     AUTH_SECRET_KEY: "n5yaP7ynm0Qf/JhIJVLXmfQH0zr+YgKwk0TdWo9EFwo=",
//     ORGANIZED_ID: "9c41d38b-1f39-42b4-800f-7e719f8a988e",
//     BACKEND_CRM_URL: "http://192.168.31.181:8949/api",
//     REACT_APP_API_BASE_URL_INTRANET: "http://192.168.31.181:8947/api",
//     BACKEND_STOCK_URL: "http://192.168.31.181:8946/api",
//     BACKEND_REPORT_URL: "http://192.168.31.181:8948/api",
//     REACT_APP_API_BASE_URL_USER: "http://192.168.31.181:8945/api",
//     AUTH_BACKEND_URL: "http://192.168.31.181:8945/api",
//     NEXTAUTH_URL: "http://192.168.31.181:8845",
//   },
//   reactStrictMode: false,
//   output: "standalone",
// };

// local
const nextConfig = {
  env: {
    AUTH_SECRET_KEY: "n5yaP7ynm0Qf/JhIJVLXmfQH0zr+YgKwk0TdWo9EFwo=",
    ORGANIZED_ID: "9c41d38b-1f39-42b4-800f-7e719f8a988e",
    NEXTAUTH_URL: "http://localhost:3000/",
    REACT_APP_AUTH_URL: "https://osd-auth.osd.co.th",
    REACT_APP_ID24_CLIENT_ID: "b7f34680-2d41-42a7-8e96-3752626c0054",
    REACT_APP_CLIENT_ID: "b7f34680-2d41-42a7-8e96-3752626c0054",
    REACT_APP_API_BASE_URL: "http://localhost:3000",
    REACT_APP_API_BASE_URL_USER: "http://localhost:4000/api",
    REACT_APP_API_BASE_URL_INTRANET: "http://localhost:4003/api",
    REACT_APP_API_BASE_URL_HR_MANAGEMENT: "http://localhost:4005/api",
    REACT_APP_USE_AUTH: "https://osd-auth.osd.co.th",
    MOUNT_DIR: "services/intranet/src",
  },
  reactStrictMode: false,
  output: "standalone",
};

module.exports = nextConfig;
