import { AxiosInstance } from "axios";

const MasterObjectiveServices = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/master-objective";
  return {
    getMasterObjectiveAll: async () => {
      return await axiosInstance
        .post(`${baseUrl}/condition`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getMasterObjectiveByFilter: async (search: object) => {
      const condition = {
        where: search,
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
    getMasterObjectiveById: async (id: number) => {
      const condition = {
        where: {
          id: id,
        },
      };
      return await axiosInstance
        .post(`${baseUrl}/condition-first`, {
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
    addMasterObjective: async (data: Object) => {
      const req = {
        data: data,
      };
      return await axiosInstance.post(`${baseUrl}`, req);
    },

    updateMasterObjective: async (id: number, data: Object) => {
      const req = {
        id: id,
        data: data,
      };
      return await axiosInstance.patch(`${baseUrl}`, req);
    },
    deleteMasterObjective: async (id: number) => {
      return await axiosInstance.delete(`${baseUrl}/${id}`);
    },
  };
};
export default MasterObjectiveServices;
