import { AxiosInstance } from "axios";
const ReportServices = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/report-transaction";
  return {
    export: async (condition: object, status: string) => {
      return await axiosInstance.post(`${baseUrl}/export-excel`, { condition: condition, status: status }, { responseType: "arraybuffer" });
    },
    findAll: async () => {
      return await axiosInstance
        .get(`${baseUrl}`)
        .then((result) => result.data)
        .catch((err) => err);
    },
    count: async (findMany: any) => {
      const condition = {
        where: findMany,
      };
      return await axiosInstance
        .post(`${baseUrl}/count`, { query: condition })
        .then((result) => result.data)
        .catch((err) => err);
    },

    findDataTable: async (findMany: any, filters: any) => {
      const { take, skip } = filters;
      const condition = {
        where: findMany,
        take: take,
        skip: skip,
      };

      return await axiosInstance
        .post(`${baseUrl}/getdatatable`, { query: condition })
        .then((result) => result.data)
        .catch((err) => err);
    },
    findBycondition: async (findMany: any) => {
      const condition = {
        where: findMany,
      };
      return await axiosInstance
        .post(`${baseUrl}/condition`, { query: condition })
        .then((result) => result.data)
        .catch((err) => err);
    },
  };
};
export default ReportServices;
