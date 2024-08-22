import { AxiosInstance } from "axios";

export const ManagehandbookFileServices = (axiosInstance: AxiosInstance) => {
  const baseUrlApihandbookFile = "/handbook-file";
  const baseUrlApihandbook = "/hand-book";
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
    uploadFiles: async (idbook: number, formData: FormData) => {
      console.log(`${baseUrlApihandbookFile}/${idbook}`);
      return axiosInstance.post(`${baseUrlApihandbookFile}/${idbook}`, formData, {headers: {
        "Content-Type": "multipart/form-data",
      },
      });
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
      console.log(handbookid);

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
    
// handbook
    gethandbookQuery: async () => {
      return await axiosInstance
        .get(`${baseUrlApihandbook}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findhandbook: async (skip: number, take: number) => {
      return await axiosInstance
        .get(`${baseUrlApihandbook}?take=${take}&skip=${skip}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findOnehandbook: async (body: any) => {
      return await axiosInstance
        .get(`${baseUrlApihandbook}/${body}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    createhandbook: async (body: any) => {
      return await axiosInstance
        .post(`${baseUrlApihandbook}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    updatehandbook: async (body: any) => {
      return await axiosInstance
        .patch(`${baseUrlApihandbook}/${body.idbook}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    deletehandbook: async (idbook: any) => {
      console.log(idbook);

      return await axiosInstance
        .delete(`${baseUrlApihandbook}/${idbook}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    // handbooktype
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
      console.log(idhandtype);

      return await axiosInstance
        .delete(`${baseUrlApihandbook}/${idhandtype}`)
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
