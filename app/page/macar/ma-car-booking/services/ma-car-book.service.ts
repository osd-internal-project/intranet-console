import { AxiosInstance } from "axios";

export const MaCarBookServices = (axiosInstance: AxiosInstance) => {
  const baseUrlApiMaCarBook = "/ma-car-book";
  const baseUrlApiMaCar = "/ma-car";
  const baseUrlApiMaCarType = "/ma-car-type";
  const baseUrlApiMaCarWrapup = "/ma-car-wrapup";
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

    getMaCarBookQuery: async (body: any) => {
      return await axiosInstance
        .get(`${baseUrlApiMaCarBook}/${body}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    findMaCarBook: async (skip: number, take: number) => {
      return await axiosInstance
        .get(`${baseUrlApiMaCarBook}?take=${take}&skip=${skip}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    createMaCarBook: async (body: any) => {
      return await axiosInstance
        .post(`${baseUrlApiMaCarBook}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    updateMaCarBook: async (bookId: number, body: any) => {
      return await axiosInstance
        .patch(`${baseUrlApiMaCarBook}/${bookId}`, body)
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
        .get(`${baseUrlApiMaCarBook}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getMaCarTypeQuery: async () => {
      return await axiosInstance
        .get(`${baseUrlApiMaCarType}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    getMaCarMileQuery: async () => {
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

    updateMaCar: async (carId: string, body: any) => {
      return await axiosInstance
        .patch(`${baseUrlApiMaCar}/${carId}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getMaCarWrapupQuery: async () => {
      return await axiosInstance
        .get(`${baseUrlApiMaCarWrapup}`)
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
