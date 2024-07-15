import { AxiosInstance } from "axios";

export const MaCarServices = (axiosInstance: AxiosInstance) => {
  const baseUrlApiMaCar = "/ma-car-book";
  const baseUrlApiMasterCar = "/ma-car";
  const baseUrlApiOrganizeChart = "/organize-chart";

  return {
    getMaCarQuery: async () => {
      return await axiosInstance
        .get(`${baseUrlApiMaCar}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findMaCar: async (skip: number, take: number) => {
      return await axiosInstance
        .get(`${baseUrlApiMaCar}?take=${take}&skip=${skip}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    createMaCar: async (body: any) => {
      return await axiosInstance
        .post(`${baseUrlApiMaCar}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getMasterCarQuery: async () => {
      return await axiosInstance
        .get(`${baseUrlApiMasterCar}`)
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
        .get(`${baseUrlApiOrganizeChart}`)
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
