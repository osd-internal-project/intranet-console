import { AxiosInstance } from "axios";

export const MaCarServices = (axiosInstance: AxiosInstance) => {
  const baseUrlApiMaCarBook = "/ma-car-book";
  const baseUrlApiMaCar = "/ma-car";
  const baseUrlApiOrganizeChart = "/organize-chart";

  // const findMaCarBook = async (
  //   skip: number,
  //   take: number,
  //   userIdData: string | undefined
  // ) => {
  //   const queryParams = new URLSearchParams({
  //     take: take.toString(),
  //     skip: skip.toString(),
  //   });

  //   const url = `${baseUrlApiMaCarBook}/${userIdData ?? ""}?${queryParams.toString()}`;

  //   console.log(url);

  //   try {
  //     const response = await axiosInstance.get(url);
  //     console.log(response);
  //     return response.data;
  //   } catch (error) {
  //     console.error(error);
  //     return [];
  //   }
  // };

  return {
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

    // findMaCarBook,
    // findMaCarBook: async (skip: number, take: number, body: any) => {
    findMaCarBook: async (body: any) => {
      return await axiosInstance
        // .get(`${baseUrlApiMaCarBook}/${body}?take=${take}&skip=${skip}`)
        .get(`${baseUrlApiMaCarBook}/${body}`)

        .then((res) => {
          console.log(body);
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    createMaCar: async (body: any) => {
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

    deleteMaCarBook: async (carId: any) => {
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

    updateMaCarBook: async (body: any) => {
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
