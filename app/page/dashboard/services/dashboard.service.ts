import { AxiosInstance } from "axios";
import dayjs from "dayjs";

const DashboardServices = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/dashboard";
  const baseUrlVenders = "/vender";
  const baseUrlMasterproduct = "/master-product";
  const baseUrlMasterproductcategories = "/master-product-categories";
  const baseUrltransactions = "/transaction";
  const baseUrlInventory = "/inventory";

  return {
    countVenders: async () => {
      return await axiosInstance
        .get(`${baseUrlVenders}/count`)
        .then((result) => result.data)
        .catch((err) => err);
    },
    countMasterProduct: async () => {
      return await axiosInstance
        .get(`${baseUrlMasterproduct}/count`)
        .then((result) => result.data)
        .catch((err) => err);
    },
    countMasterInventory: async () => {
      return await axiosInstance
        .post(`${baseUrlInventory}/count`)
        .then((result) => result.data)
        .catch((err) => err);
    },

    countStatusDepartmentOverview: async (valuestatus: string) => {
      const startDate = dayjs().startOf("date"); // Example start date
      const endDate = dayjs().endOf("date"); // Example end date
      const condition = {
        where: {
          status: valuestatus,
          updatedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      };

      return await axiosInstance
        .post(`${baseUrltransactions}/count-status`, { condition: condition })
        .then((result) => result.data)
        .catch((err) => err);
    },
    countCostDepartmentOverview: async () => {
      return await axiosInstance
        .post(`${baseUrltransactions}/count-cost`)
        .then((result) => result.data)
        .catch((err) => err);
    },
    findMostOrderOfDepartment: async () => {
      return await axiosInstance
        .get(`${baseUrl}/department`)
        .then((result) => result.data)
        .catch((err) => []);
    },
    findMostOrder: async () => {
      return await axiosInstance
        .get(`${baseUrl}/most-orders`)
        .then((result) => result.data)
        .catch((err) => []);
    },
    countOutofstockDepartmentOverview: async () => {
      return await axiosInstance
        .get(`${baseUrlMasterproduct}/count-out-of-stock`)
        .then((result) => result.data)
        .catch((err) => err);
    },

    findCountStockPerMonth: async () => {
      return await axiosInstance
        .get(`${baseUrl}/count-per-month`)
        .then((result) => result.data)
        .catch((err) => err);
    },
    findAmountStockPerMonth: async () => {
      return await axiosInstance
        .get(`${baseUrl}/amount-per-month`)
        .then((result) => result.data)
        .catch((err) => err);
    },
  };
};
export default DashboardServices;
