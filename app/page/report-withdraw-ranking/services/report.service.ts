import { AxiosInstance } from "axios";
const TransactionServices = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/report-withdraw-ranking";
  return {
    export: async (condition: object) => {
      return await axiosInstance.post(`${baseUrl}/export-excel`, { query: condition }, { responseType: "arraybuffer" });
    },
    findAll: async () => {
      return await axiosInstance
        .get(`${baseUrl}`)
        .then((result) => result.data)
        .catch((err) => err);
    },
    findBycondition: async (condition: any) => {
      return await axiosInstance
        .post(`${baseUrl}/condition`, { query: condition })
        .then((result) => result.data)
        .catch((err) => err);
    },
  };
};
export default TransactionServices;
