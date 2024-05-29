import { AxiosInstance } from "axios";

const ExpiredServices = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/report-transaction-expired";
  return {
    export: async (condition: object) => {
      return await axiosInstance.post(`${baseUrl}/export-excel`, { query: condition }, { responseType: "arraybuffer" });
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

    getInventorylotByExpiredDate: async (
      search: any,
      filter: {
        take: number;
        skip: number;
        current: number;
      },
    ) => {
      const condition = {
        query: search,
        pagination: { current: filter.current, pageSize: filter.take },
      };
      return await axiosInstance
        .post(`${baseUrl}/condition-expired-date`, condition)
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

export default ExpiredServices;
