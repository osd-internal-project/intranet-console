import { AxiosInstance } from "axios";

export const ManageCarServices = (axiosInstance: AxiosInstance) => {
  const baseUrlApiMaCarBook = "/ma-car-book";
  const baseUrlApiMaCar = "/ma-car";

  return {
    getMaCarBookQuery: async () => {
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

    updateMaCarBook: async (body: any) => {
      console.log(body);
      return await axiosInstance
        .patch(`${baseUrlApiMaCarBook}/${body.id}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    deleteMaCarBook: async (carId: any) => {
      console.log(carId);

      return await axiosInstance
        .delete(`${baseUrlApiMaCarBook}/${carId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
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
    updateMaCar: async (body: any) => {
      return await axiosInstance
        .patch(`${baseUrlApiMaCar}/${body.carId}`, body)
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
    deleteMaCar: async (carId: any) => {
      console.log(`${baseUrlApiMaCar}/${carId}`);
      return await axiosInstance
        .delete(`${baseUrlApiMaCar}/${carId}`)
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
