/** @type {import('next').NextConfig} */

const nextConfigDomainServer = {
  env: {
    AUTH_SECRET_KEY: "n5yaP7ynm0Qf/JhIJVLXmfQH0zr+YgKwk0TdWo9EFwo=",
    ORGANIZED_ID: "9c41d38b-1f39-42b4-800f-7e719f8a988e",
    BACKEND_CRM_URL: "https://d-service.osd.co.th:8845/public/api/crm",
    BACKEND_INTRANET_URL: "https://d-service.osd.co.th:8845/public/api/intranet",
    BACKEND_STOCK_URL: "https://d-service.osd.co.th:8845/public/api/stock",
    BACKEND_REPORT_URL: "https://d-service.osd.co.th:8845/public/api/report",
    BACKEND_USER_URL: "https://d-service.osd.co.th:8845/public/api/user",
    AUTH_BACKEND_URL: "https://d-service.osd.co.th:8845/public/api/user",
    NEXTAUTH_URL: "https://d-service.osd.co.th:8845",
  },
  reactStrictMode: false,
  output: "standalone",
};

const nextConfigServer = {
  env: {
    AUTH_SECRET_KEY: "n5yaP7ynm0Qf/JhIJVLXmfQH0zr+YgKwk0TdWo9EFwo=",
    ORGANIZED_ID: "9c41d38b-1f39-42b4-800f-7e719f8a988e",
    BACKEND_CRM_URL: "http://192.168.31.181:8949/api",
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

const nextConfigLocal = {
  env: {
    AUTH_SECRET_KEY: "n5yaP7ynm0Qf/JhIJVLXmfQH0zr+YgKwk0TdWo9EFwo=",
    ORGANIZED_ID: "9c41d38b-1f39-42b4-800f-7e719f8a988e",
    BACKEND_CRM_URL: "http://localhost:4005/api",
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

module.exports = nextConfigLocal;
