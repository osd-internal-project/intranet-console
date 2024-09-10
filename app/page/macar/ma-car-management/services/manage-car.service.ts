import { AxiosInstance } from "axios";

export const ManageCarServices = (axiosInstance: AxiosInstance) => {
  const baseUrlApiMaCarBook = "/ma-car-book";
  const baseUrlApiMaCar = "/ma-car";
  const baseUrlApiMaCarTpye = "/ma-car-type";
  const baseUrlApiMaCarwarpup = "/ma-car-wrapup";
  const baseUrlApiMaCarwarpupimage = "/ma-car-wrapup-image";

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
        .patch(`${baseUrlApiMaCarTpye}/${body.id}`, body)
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

    getMaCarQueryWarpupimage: async () => {
      return await axiosInstance
        .get(`${baseUrlApiMaCarwarpupimage}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    updateMaCarWarpupimage: async (carWrapupId: string, body: any) => {
      return await axiosInstance
        .patch(`${baseUrlApiMaCarwarpupimage}/${carWrapupId}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    uploadFiles: async (carWrapupId: string, formData: FormData) => {
      return axiosInstance.post(`${baseUrlApiMaCarwarpupimage}/${carWrapupId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },

    createMaCarWarpupimage: async (body: any) => {
      return await axiosInstance
        .post(`${baseUrlApiMaCarwarpupimage}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    deleteMaCarWarpupimage: async (idwarpupImage: any) => {
      console.log(`${baseUrlApiMaCarTpye}/${idwarpupImage}`);
      return await axiosInstance
        .delete(`${baseUrlApiMaCarwarpupimage}/${idwarpupImage}`)
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
