/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    AUTH_SECRET_KEY: "n5yaP7ynm0Qf/JhIJVLXmfQH0zr+YgKwk0TdWo9EFwo=",
    ORGANIZED_ID: "9c41d38b-1f39-42b4-800f-7e719f8a988e",
    BACKEND_INTRANET_URL: "http://localhost:4003/api",
    BACKEND_STOCK_URL: "http://localhost:4001/api",
    BACKEND_REPORT_URL: "http://localhost:4002/api",
    BACKEND_USER_URL: "http://localhost:4000/api",
    AUTH_BACKEND_URL: "http://localhost:4000/api",

    NEXTAUTH_URL: "http://localhost:3000/",
  },
  reactStrictMode: false,
  output: "standalone",
};

module.exports = nextConfig;
