import { AxiosInstance } from "axios";
import { addUnit } from "../common";
// import { ITypeCreateBodyBrands } from "../common";

export const UnitServices = (axiosInstance: AxiosInstance) => {
  const apiListMasterUnit = "/unit";

  return {
    findAll: async () => {
      return await axiosInstance
        .get(`${apiListMasterUnit}`)
        .then((result) => result.data)
        .catch((err) => err);
    },
    findMany: async (search: any) => {
      const condition = {
        where: search,
      };
      return await axiosInstance
        .post(`${apiListMasterUnit}/condition`, {
          condition: condition,
        })
        .then((result) => result.data)
        .catch((err) => err);
    },
    create: async (data: addUnit) => {
      const condition = {
        data: {
          unitName: data.name,
        },
      };
      return await axiosInstance
        .post(`${apiListMasterUnit}`, condition)
        .then((result) => result.data)
        .catch((err) => err);
    },
    update: async (condition: any) => {
      return await axiosInstance
        .patch(`${apiListMasterUnit}`, condition)
        .then((result) => result.data)
        .catch((err) => err);
    },
    remove: async (res: number) => {
      const dataResult = {
        id: res,
      };
      return await axiosInstance
        .delete(`${apiListMasterUnit}`, { data: dataResult })
        .then((result) => result.data)
        .catch((err) => err);
    },
  };
};
