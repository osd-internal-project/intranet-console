import { AxiosInstance } from "axios";
import { ITypeCreateBodyBrands } from "../common";

export const BrandService = (axiosInstance: AxiosInstance) => {
  const apiListMasterBrands = "/brand";

  return {
    findAll: async () => {
      return await axiosInstance
        .get(`${apiListMasterBrands}`)
        .then((result) => result.data)
        .catch((err) => err);
    },
    findMany: async (findMany: any) => {
      const condition = {
        where: findMany,
      };
      return await axiosInstance
        .post(`${apiListMasterBrands}/condition`, {
          condition: condition,
        })
        .then((result) => result.data)
        .catch((err) => err);
    },
    create: async (condition: ITypeCreateBodyBrands) => {
      return await axiosInstance
        .post(`${apiListMasterBrands}`, condition)
        .then((result) => result.data)
        .catch((err) => err);
    },
    update: async (condition: ITypeCreateBodyBrands) => {
      return await axiosInstance
        .patch(`${apiListMasterBrands}`, condition)
        .then((result) => result.data)
        .catch((err) => err);
    },
    remove: async (res: number) => {
      const dataResult = {
        id: res,
      };
      return await axiosInstance
        .delete(`${apiListMasterBrands}`, { data: dataResult })
        .then((result) => result.data)
        .catch((err) => err);
    },
  };
};
