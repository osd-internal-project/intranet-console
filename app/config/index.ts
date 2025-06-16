const config = {
  backendIntranetUrl: process.env.REACT_APP_API_BASE_URL_INTRANET,
  backendUserUrl: process.env.BACKEND_USER_URL,
  jwtSecret: process.env.JWT_SECERT,
  pageversion: process.env.PAGE_VERSION,
};

export default config;
