import { AxiosInstance } from "axios";

export const ManageemailTemplateServices = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/email-template";
  // const baseTemplateFieldsUrl = "/email-template-fields";
  const baseTemplateTypeUrl = "/email-template-type";

  return {
    findAll: async () => {
      return await axiosInstance
        .get(`${baseUrl}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findByType: async (value: number) => {
      return await axiosInstance
        .get(`${baseUrl}/type/${value}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findOne: async (body: any) => {
      return await axiosInstance
        .get(`${baseUrl}/${body}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findMasterDataType: async () => {
      return await axiosInstance
        .get(`${baseTemplateTypeUrl}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    optionsTemplate: async () => {
      return await axiosInstance
        .get(`${baseUrl}/options`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    optionsType: async () => {
      return await axiosInstance
        .get(`${baseTemplateTypeUrl}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    create: async (body: any) => {
      return await axiosInstance
        .post(`${baseUrl}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    update: async (id: string, body: any) => {
      return await axiosInstance
        .patch(`${baseUrl}/${id}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    updateType: async (body: any) => {
      return await axiosInstance
        .patch(`${baseTemplateTypeUrl}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    delete: async (id: string) => {
      return await axiosInstance
        .delete(`${baseUrl}/${id}`)
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
