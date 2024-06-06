import { AxiosInstance } from "axios";
// import { addUnit } from "../common";
import { addPosition } from "../common";

export const PositionServices = (axiosInstance: AxiosInstance) => {
  const apiListMasterPosition = "/master-position";

  return {
    findAll: async () => {
      return await axiosInstance
        .get(`${apiListMasterPosition}`)
        .then((result) => result.data)
        .catch((err) => err);
    },
    findMany: async (search: any) => {
      const condition = {
        where: search,
      };
      return await axiosInstance
        .post(`${apiListMasterPosition}/condition`, {
          condition: condition,
        })
        .then((result) => result.data)
        .catch((err) => err);
    },
    create: async (data: addPosition) => {
      const condition = {
        data: {
          nameTh: data.nameTh,
          nameEn: data.nameEn,
        },
      };
      return await axiosInstance
        .post(`${apiListMasterPosition}`, condition)
        .then((result) => result.data)
        .catch((err) => err);
    },
    update: async (condition: any) => {
      return await axiosInstance
        .patch(`${apiListMasterPosition}`, condition)
        .then((result) => result.data)
        .catch((err) => err);
    },
    remove: async (res: number) => {
      const dataResult = {
        id: res,
      };
      return await axiosInstance
        .delete(`${apiListMasterPosition}`, { data: dataResult })
        .then((result) => result.data)
        .catch((err) => err);
    },
  };
};
