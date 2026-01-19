import { AxiosInstance } from "axios";
import type { ITComplainProblem } from "../common/complain-problem";

export interface TServices {
  findAll: () => Promise<ITComplainProblem[]>;
  findByUserId: (userId: string, values: { type: string; name: string }) => Promise<ITComplainProblem[]>;
  create: (form: any) => Promise<ITComplainProblem>;
  update: (id: number, form: any) => Promise<ITComplainProblem>;
  delete: (id: number) => Promise<ITComplainProblem>;
  export: (userId: string, values: { type: string; name: string }) => Promise<ArrayBuffer>;
}

const ComplainProblemServices = (axiosInstance: AxiosInstance): TServices => {
  const baseUrl = "/complain-problem";
  const baseUrlReport = "/report-complain-problem";

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
    findByUserId: async (userId: string, values: { type: string; name: string }) => {
      return await axiosInstance
        .get(`${baseUrl}/find-many/${userId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    create: async (form) => {
      return await axiosInstance
        .post(`${baseUrl}`, form)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    update: async (id: number, form) => {
      return await axiosInstance
        .patch(`${baseUrl}/${id}`, form)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    delete: async (id: number) => {
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
    export: async (userId: string, values: { type: string; name: string }) => {
      return await axiosInstance
        .get(`${baseUrlReport}/export/${userId}`, { params: values, responseType: "blob" })
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
export default ComplainProblemServices;
