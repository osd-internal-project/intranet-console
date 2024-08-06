import { AxiosInstance } from "axios";

export const ManagehandbookFileServices = (axiosInstance: AxiosInstance) => {
  const baseUrlApihandbookFile = "/handbookFile";

  return {
    gethandbookFileQuery: async () => {
      return await axiosInstance
        .get(`${baseUrlApihandbookFile}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findhandbookFile: async (skip: number, take: number) => {
      return await axiosInstance
        .get(`${baseUrlApihandbookFile}?take=${take}&skip=${skip}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findOnehandbookFile: async (body: any) => {
      return await axiosInstance
        .get(`${baseUrlApihandbookFile}/${body}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    createhandbookFile: async (body: any) => {
      return await axiosInstance
        .post(`${baseUrlApihandbookFile}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    updatehandbookFile: async (body: any) => {
      return await axiosInstance
        .patch(`${baseUrlApihandbookFile}/${body.id}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    deletehandbookFile: async (carId: any) => {
      console.log(carId);

      return await axiosInstance
        .delete(`${baseUrlApihandbookFile}/${carId}`)
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
