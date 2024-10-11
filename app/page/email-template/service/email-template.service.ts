import { AxiosInstance } from "axios";

export const ManageemailTemplateServices = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/email-template";
  const baseTemplateFieldsUrl = "/email-template-fields";
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

    update: async (body: any) => {
      return await axiosInstance
        .patch(`${baseUrl}/${body.handbookid}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    delete: async (handbookid: any) => {
      return await axiosInstance
        .delete(`${baseUrl}/${handbookid}`)
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
