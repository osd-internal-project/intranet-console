import { AxiosInstance } from "axios";
const MasterTypeLeaveService = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/master-type-leave";
  return {
    getdataAll: async (search: any) => {
      const condition = {
        where: search,
        orderBy: { id: "asc" },
      };
      return await axiosInstance
        .post(`${baseUrl}/condition`, {
          condition: condition,
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    createTypeleave: async (event: any) => {
      const condition = {
        ...event,
      };
      return await axiosInstance
        .post(`${baseUrl}`, {
          condition: condition,
        })
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
export default MasterTypeLeaveService;
