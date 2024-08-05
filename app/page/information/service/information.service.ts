import { AxiosInstance } from "axios";

export const ManageCarServices = (axiosInstance: AxiosInstance) => {
  const baseUrlApihandbookFile = "/handbookFile";
  const baseUrlApiinformationNews = "/informationNews";
  const baseUrlApinewsImage = "/newsImage";
  const baseUrlApinewsType = "/newsType";

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


    getinformationNewsQuery: async () => {
      return await axiosInstance
        .get(`${baseUrlApiinformationNews}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    updateinformationNews: async (body: any) => {
      return await axiosInstance
        .patch(`${baseUrlApiinformationNews}/${body.carId}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    createinformationNews: async (body: any) => {
      return await axiosInstance
        .post(`${baseUrlApiinformationNews}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    deleteinformationNews: async (carId: any) => {
      console.log(`${baseUrlApiinformationNews}/${carId}`);
      return await axiosInstance
        .delete(`${baseUrlApiinformationNews}/${carId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },


    // ma car type
    getnewsImageQuery: async () => {
      return await axiosInstance
        .get(`${baseUrlApinewsImage}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    updatenewsImage: async (body: any) => {
      return await axiosInstance
        .patch(`${baseUrlApinewsImage}/${body.id}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    createnewsImage: async (body: any) => {
      return await axiosInstance
        .post(`${baseUrlApinewsImage}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    deletenewsImage: async (carId: any) => {
      console.log(`${baseUrlApinewsImage}/${carId}`);
      return await axiosInstance
        .delete(`${baseUrlApinewsImage}/${carId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },


    getnewsTypeQuery: async () => {
      return await axiosInstance
        .get(`${baseUrlApinewsType}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    updatenewsType: async (carWrapupId: string, body: any) => {
      return await axiosInstance
        .patch(`${baseUrlApinewsType}/${carWrapupId}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    createnewsType: async (body: any) => {
      return await axiosInstance
        .post(`${baseUrlApinewsType}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    deletenewsType: async (carId: any) => {
      console.log(`${baseUrlApinewsType}/${carId}`);
      return await axiosInstance
        .delete(`${baseUrlApinewsType}/${carId}`)
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
