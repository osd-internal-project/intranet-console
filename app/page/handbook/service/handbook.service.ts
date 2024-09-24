import { AxiosInstance } from "axios";

export const ManagehandbookFileServices = (axiosInstance: AxiosInstance) => {
  const baseUrlApihandbookFile = "/handbook-file";
  const baseUrlApihandbooktype = "/handbook-type";
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
    uploadFiles: async (formData: FormData) => {
      return axiosInstance.post(
        `${baseUrlApihandbookFile}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    
    updatehandbookFile: async (body: any) => {
      return await axiosInstance
        .patch(`${baseUrlApihandbookFile}/${body.handbookid}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    deletehandbookFile: async (handbookid: any) => {
      return await axiosInstance
        .delete(`${baseUrlApihandbookFile}/${handbookid}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    gethandbooktypeQuery: async () => {
      return await axiosInstance
        .get(`${baseUrlApihandbooktype}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findhandbooktype: async (skip: number, take: number) => {
      return await axiosInstance
        .get(`${baseUrlApihandbooktype}?take=${take}&skip=${skip}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findOnehandbooktype: async (body: any) => {
      return await axiosInstance
        .get(`${baseUrlApihandbooktype}/${body}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    createhandbooktype: async (body: any) => {
      return await axiosInstance
        .post(`${baseUrlApihandbooktype}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    updatehandbooktype: async (body: any) => {
      return await axiosInstance
        .patch(`${baseUrlApihandbooktype}/${body.idhandtype}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    deletehandbooktype: async (idhandtype: any) => {
      return await axiosInstance
        .delete(`${baseUrlApihandbooktype}/${idhandtype}`)
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
