import { AxiosInstance } from "axios";
// import { addUnit } from "../common";
import { TCreatePositionDto } from "../common";

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
    create: async (data: TCreatePositionDto) => {
      return await axiosInstance
        .post(`${apiListMasterPosition}`, data)
        .then((result) => result.data);
    },
    update: async (condition: any) => {
      return await axiosInstance
        .patch(`${apiListMasterPosition}`, condition)
        .then((result) => result.data);
    },
    remove: async (res: number) => {
      const dataResult = {
        id: res,
      };
      return await axiosInstance
        .delete(`${apiListMasterPosition}`, { data: dataResult })
        .then((result) => result.data);
    },
  };
};
