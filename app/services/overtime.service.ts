import { AxiosInstance } from "axios";

export interface TServices {
  findAll: () => Promise<any[]>;
  findMasterOt: (date: any) => Promise<number>;
  create: (condition: any) => Promise<any[]>;
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
  };
};
export default OverTimeServices;
