import { AxiosInstance } from "axios";
import { IOverTimeForm } from "../common/overtime";
import dayjs from "dayjs";

export interface TServices {
  findAll: () => Promise<IOverTimeForm[]>;
  findMany: (skip: number, take: number, params: any) => Promise<{ data: IOverTimeForm[]; total: number }>;
  findManyHr: (skip: number, take: number, params: any) => Promise<{ data: IOverTimeForm[]; total: number }>;
  findById: (skip: number, take: number) => Promise<any[]>;
  findMasterOt: (date: any) => Promise<number>;
  create: (condition: any) => Promise<any[]>;
  update: (overTimeID: string, type: string, user: { userId?: string; fullName?: string }) => Promise<any[]>;
  delete: (overTimeID: string) => Promise<any[]>;
}
const OverTimeServices = (axiosInstance: AxiosInstance): TServices => {
  const baseUrl = "/overtime";
  const baseMasterOtUrl = "/master-config-ot";
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
    findMany: async (skip, take, params) => {
      return await axiosInstance
        .get(`${baseUrl}/find-many`, { params: { take, skip, params } })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findManyHr: async (skip, take, params) => {
      return await axiosInstance
        .get(`${baseUrl}/find-many-hr`, { params: { take, skip, params } })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findById: async (skip, take) => {
      return await axiosInstance
        .get(`${baseUrl}/by-id?take=${take}&skip=${skip}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findMasterOt: async (date) => {
      return await axiosInstance
        .get(`${baseMasterOtUrl}/by-date/${date}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    create: async (condition: any) => {
      return await axiosInstance
        .post(`${baseUrl}`, { ...condition })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    update: async (overTimeID: string, type: string, user: { userId?: string; fullName?: string }) => {
      return await axiosInstance
        .patch(`${baseUrl}/${overTimeID}`, { status: type, approvedUser: user.fullName, approvedDate: dayjs(new Date()) })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    delete: async (overTimeID: string) => {
      return await axiosInstance
        .delete(`${baseUrl}/${overTimeID}`)
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
export default OverTimeServices;
