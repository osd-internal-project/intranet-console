import { AxiosInstance } from "axios";

export const ManageinformationNewsServices = (axiosInstance: AxiosInstance) => {
  const baseUrlApiinformationNews = "/informationNews";
  const baseUrlApinewsImage = "/news-image";
  const baseUrlApinewsType = "/newsType";

  return {
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
        .patch(`${baseUrlApiinformationNews}/${body.newsId}`, body)
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
    deleteinformationNews: async (newsId: any) => {
      console.log(`${baseUrlApiinformationNews}/${newsId}`);
      return await axiosInstance
        .delete(`${baseUrlApiinformationNews}/${newsId}`)
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
    uploadFiles: async (newsId: number, formData: FormData) => {
      return axiosInstance.post(`${baseUrlApinewsImage}/${newsId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    deletenewsImage: async (imageId: any) => {
      console.log(`${baseUrlApinewsImage}/${imageId}`);
      return await axiosInstance
        .delete(`${baseUrlApinewsImage}/${imageId}`)
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
    updatenewsType: async (body: any) => {
      return await axiosInstance
        .patch(`${baseUrlApinewsType}/${body.idType}`, body)
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
    deletenewsType: async (idType: any) => {
      console.log(`${baseUrlApinewsType}/${idType}`);
      return await axiosInstance
        .delete(`${baseUrlApinewsType}/${idType}`)
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
