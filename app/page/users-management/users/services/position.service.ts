import { AxiosInstance } from "axios";
const MasterPositionServices = (axiosInstance: AxiosInstance) => {
  return {
    getMasterPositionAll: async () => {
      const baseUrl = "master-position";
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
  };
};
export default MasterPositionServices;
