import { AxiosInstance } from "axios";

export const MaCarBookServices = (axiosInstance: AxiosInstance) => {
  const baseUrlApiMaCarBook = "/ma-car-book";
  const baseUrlApiMaCar = "/ma-car";
  const baseUrlApiMaCarType = "/ma-car-type";
  const baseUrlApiMaCarWrapup = "/ma-car-wrapup";
  const baseUrlmaCarBookingImages = "/ma-car-booking-images";
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

    getMaCarBookQuery: async (userId: string) => {
      console.log(userId);
      return await axiosInstance
        .get(`${baseUrlApiMaCarBook}/car-booking/${userId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getMaCarBookCheck: async (carId: string, carBookStartDate: Date, carBookEndDate: Date) => {
      return await axiosInstance
        .get(`${baseUrlApiMaCarBook}/carId/${carId}`, { params: { carBookStartDate, carBookEndDate } })
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
    updateMaCarBookingImages: async (bookId: number, body: any) => {
      return await axiosInstance
        .post(`${baseUrlmaCarBookingImages}/upload-images/${24}`, body, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
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
