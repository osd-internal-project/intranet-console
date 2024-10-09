import { AxiosInstance } from "axios";

export const ManageemailTemplateServices = (axiosInstance: AxiosInstance) => {
  const baseUrlApiemailTemplate = "/emailtemplate";
  return {
    getemailTemplateQuery: async () => {
      return await axiosInstance
        .get(`${baseUrlApiemailTemplate}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findemailTemplate: async (skip: number, take: number) => {
      return await axiosInstance
        .get(`${baseUrlApiemailTemplate}?take=${take}&skip=${skip}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findOneemailTemplate: async (body: any) => {
      return await axiosInstance
        .get(`${baseUrlApiemailTemplate}/${body}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    createemailTemplate: async (body: any) => {
      return await axiosInstance
        .post(`${baseUrlApiemailTemplate}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    updateemailTemplate: async (body: any) => {
      return await axiosInstance
        .patch(`${baseUrlApiemailTemplate}/${body.handbookid}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    deleteemailTemplate: async (handbookid: any) => {
      return await axiosInstance
        .delete(`${baseUrlApiemailTemplate}/${handbookid}`)
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
