import { AxiosInstance } from "axios";
import { IOverTimeForm } from "../common/overtime";
import dayjs, { Dayjs } from "dayjs";

export interface TServices {
  findAll: () => Promise<IOverTimeForm[]>;
  findMany: (skip: number, take: number, params: any) => Promise<{ data: IOverTimeForm[]; total: number }>;
  findManyHr: (skip: number, take: number, params: any) => Promise<{ data: IOverTimeForm[]; total: number }>;
  findById: (skip: number, take: number) => Promise<{ data: IOverTimeForm[]; count: number }>;
  findCalendar: (month: Date | Dayjs | string) => Promise<IOverTimeForm[]>;
  findMasterOt: (date: any) => Promise<number>;
  create: (condition: any) => Promise<any[]>;
  update: (overTimeID: string, type: string, description: string, user: { userId?: string; fullName?: string }) => Promise<any[]>;
  delete: (overTimeID: string) => Promise<any[]>;
  exportReport: (page: { search: object }) => Promise<ArrayBuffer>;
}
const OverTimeServices = (axiosInstance: AxiosInstance): TServices => {
  const baseUrl = "/overtime";
  const baseMasterOtUrl = "/master-config-ot";
  const baseReportOt = "/report-ot";

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
    findCalendar: async (month) => {
      const condition = { month };
      return await axiosInstance
        .get(`${baseUrl}/calendar`, { params: condition })
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
        });
    },
    update: async (overTimeID: string, type: string, description: string, user: { userId?: string; fullName?: string }) => {
      return await axiosInstance
        .patch(`${baseUrl}/${overTimeID}`, {
          status: type,
          approvedUser: user.fullName,
          approvedDate: dayjs(new Date()),
          approvedDetail: description,
        })
        .then((res) => {
          return res.data;
        });
    },
    delete: async (overTimeID: string) => {
      return await axiosInstance
        .delete(`${baseUrl}/${overTimeID}`)
        .then((res) => {
          return res.data;
        });
    },
    exportReport: async (req: { search: object }) => {
      return await axiosInstance
        .get(`${baseReportOt}/export`, { params: req.search, responseType: "blob" })
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
