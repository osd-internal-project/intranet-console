import { AxiosInstance } from "axios";
// import { ITypeCreateBodyBrands } from "../common";

export const InventoryServices = (axiosInstance: AxiosInstance) => {
  const apiListMasterInventory = "/inventory";

  return {
    findAll: async () => {
      return await axiosInstance
        .get(`${apiListMasterInventory}`)
        .then((result) => result.data)
        .catch((err) => err);
    },
    findinventorybyID: async (location_id: number | null, search: any) => {
      const where = location_id ? { ...search, locationId: location_id } : { ...search };
      const condition = {
        condition: {
          where: where,
        },
      };
      return await axiosInstance
        .post(`${apiListMasterInventory}/condition`, condition)
        .then((result) => result.data)
        .catch((err) => err);
    },
    create: async (condition: any) => {
      return await axiosInstance
        .post(`${apiListMasterInventory}`, condition)
        .then((result) => result.data)
        .catch((err) => err);
    },
    update: async (condition: any) => {
      return await axiosInstance
        .patch(`${apiListMasterInventory}`, condition)
        .then((result) => result.data)
        .catch((err) => err);
    },
    remove: async (res: number) => {
      const dataResult = {
        id: res,
      };
      return await axiosInstance
        .delete(`${apiListMasterInventory}`, { data: dataResult })
        .then((result) => result.data)
        .catch((err) => err);
    },
  };
};
