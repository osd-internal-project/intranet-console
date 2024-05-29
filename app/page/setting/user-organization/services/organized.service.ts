import { AxiosInstance } from "axios";

const OrganizedServices = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/organized";
  return {
    getOrganizedAll: async () => {
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
    getOrganizedByFilter: async (search: object) => {
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
    getOrganizedByOrganizedId: async (organizedId: string) => {
      const condition = {
        where: {
          organizedId: organizedId,
        },
      };
      return await axiosInstance.post(`${baseUrl}/condition`, {
        condition: condition,
      });
    },
    addOrganized: async (data: Object) => {
      const req = {
        data: data,
      };
      return await axiosInstance.post(`${baseUrl}`, req);
    },

    updateOrganized: async (organizedId: string, data: Object) => {
      const req = {
        organizedId: organizedId,
        data: data,
      };
      return await axiosInstance.patch(`${baseUrl}`, req);
    },
    deleteOrganized: async (organizedId: string) => {
      return await axiosInstance.delete(`${baseUrl}/${organizedId}`);
    },
  };
};
export default OrganizedServices;
