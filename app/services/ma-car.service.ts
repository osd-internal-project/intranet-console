import { AxiosInstance } from "axios";
import { Dayjs } from "dayjs";
import { MaCarBookFilter } from "../page/macar/common";

export const MaCarServices = (axiosInstance: AxiosInstance) => {
  const baseUrlApiMaCarBook = "/ma-car-book";
  const baseUrlApiMaCar = "/ma-car";
  const baseUrlApiOrganizeChart = "/organize-chart";

  return {
    getMaCarBookQuery: async () => {
      return await axiosInstance
        .get(`${baseUrlApiMaCarBook}/findbytoken`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getMaCarBookCalendar: async (month: Date | Dayjs | string) => {
      const condition = {
        month,
      };
      return await axiosInstance
        .get(`${baseUrlApiMaCarBook}/calendar`, { params: condition })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getMaCarBookAllQuery: async () => {
      return await axiosInstance
        .get(`${baseUrlApiMaCarBook}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findMaCarBook: async (skip: number, take: number, filters?: MaCarBookFilter) => {
      return await axiosInstance
        .get(`${baseUrlApiMaCarBook}/${skip}/${take}`, { params: filters })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findMaCarBookById: async (userId: any) => {
      return await axiosInstance
        .get(`${baseUrlApiMaCarBook}/${userId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    },

    createMaCar: async (body: any) => {
      return await axiosInstance
        .post(`${baseUrlApiMaCarBook}`, body)
        .then((res) => {
          return res.data;
        });
    },

    deleteMaCarBook: async (carId: any) => {
      return await axiosInstance
        .delete(`${baseUrlApiMaCarBook}/${carId}`)
        .then((res) => {
          return res.data;
        });
    },

    updateMaCarBook: async (body: any) => {
      return await axiosInstance
        .patch(`${baseUrlApiMaCarBook}/${body.id}`, body)
        .then((res) => {
          return res.data;
        });
    },

    updateMaCar: async (carId: string, body: any) => {
      return await axiosInstance
        .patch(`${baseUrlApiMaCar}/${carId}`, body)
        .then((res) => {
          return res.data;
        });
    },

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
    getMaCarById: async (carId: string) => {
      return await axiosInstance
        .get(`${baseUrlApiMaCar}/${carId}`)
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
