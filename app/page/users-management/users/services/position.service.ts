import { AxiosInstance } from "axios";
const MasterPositionService = (axiosInstance: AxiosInstance) => {
  const baseUrl = "master-position";
  const baseHrUrl = "hr-management";
  return {
    getMasterPositionAll: async () => {
      return await axiosInstance
        .get(`${baseUrl}/`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getUserGroupAll: async () => {
      return await axiosInstance
        .post(`/user-group/condition`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getOrganizeChartQuery: async () => {
      return await axiosInstance
        .get(`/organize-chart`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
  };
};
export default MasterPositionService;
