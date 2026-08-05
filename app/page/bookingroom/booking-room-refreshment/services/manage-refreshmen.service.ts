import { AxiosInstance } from "axios";

export const ManageRefreshmentServices = (axiosInstance: AxiosInstance) => {
  const baseUrlApiMasterRefreshment = "/refreshment";

  return {
    findMasterRefreshment: async (skip: number, take: number) => {
      return await axiosInstance
        .get(`${baseUrlApiMasterRefreshment}?take=${take}&skip=${skip}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    createMasterRefreshment: async (body: any) => {
      return await axiosInstance
        .post(`${baseUrlApiMasterRefreshment}`, body)
        .then((res) => {
          return res.data;
        });
    },
    updateMasterRefreshment: async (body: any) => {
      return await axiosInstance
        .patch(`${baseUrlApiMasterRefreshment}/${body.id}`, body)
        .then((res) => {
          return res.data;
        });
    },

    deleteMasterRefreshment: async (id: any) => {
      return await axiosInstance
        .delete(`${baseUrlApiMasterRefreshment}/${id}`)
        .then((res) => {
          return res.data;
        });
    },

    getMasterRefreshmentQuery: async () => {
      return await axiosInstance
        .get(`${baseUrlApiMasterRefreshment}`)
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
