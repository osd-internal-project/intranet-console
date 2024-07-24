import { AxiosInstance } from "axios";

export const ManageCarServices = (axiosInstance: AxiosInstance) => {
  const baseUrlApiMaCarBook = "/ma-car-book";
  const baseUrlApiMaCar = "/ma-car";
  const baseUrlApiMaCarTpye = "/ma-car-type";
  const baseUrlApiMaCarwarpup = "/ma-car-wrapup";

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
    findOneMaCarBook: async (body: any) => {
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
    // ma car type
    getMaCarQueryType: async () => {
      return await axiosInstance
        .get(`${baseUrlApiMaCarTpye}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    updateMaCarType: async (body: any) => {
      return await axiosInstance
        .patch(`${baseUrlApiMaCarTpye}/${body.carId}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    createMaCarType: async (body: any) => {
      return await axiosInstance
        .post(`${baseUrlApiMaCarTpye}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    deleteMaCarType: async (carId: any) => {
      console.log(`${baseUrlApiMaCarTpye}/${carId}`);
      return await axiosInstance
        .delete(`${baseUrlApiMaCarTpye}/${carId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getMaCarQueryWarpup: async () => {
      return await axiosInstance
        .get(`${baseUrlApiMaCarwarpup}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    updateMaCarWarpup: async (carWrapupId: string, body: any) => {
      return await axiosInstance
        .patch(`${baseUrlApiMaCarwarpup}/${carWrapupId}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    createMaCarWarpup: async (body: any) => {
      return await axiosInstance
        .post(`${baseUrlApiMaCarwarpup}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    deleteMaCarWarpup: async (carId: any) => {
      console.log(`${baseUrlApiMaCarTpye}/${carId}`);
      return await axiosInstance
        .delete(`${baseUrlApiMaCarwarpup}/${carId}`)
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
