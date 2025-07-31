import { AxiosInstance } from "axios";
import { ITUnit, ITUnitCreateInput } from "../common";
import { Dayjs } from "dayjs";
interface TServices {
  findMany: (
    search: { unitName?: string; createdAt?: Dayjs | string | null },
    skip: number,
    take: number,
  ) => Promise<{ data: ITUnit[]; count: number }>;
  create: (data: ITUnitCreateInput) => Promise<ITUnit>;
  update: (id: number, data: ITUnitCreateInput) => Promise<ITUnit>;
  delete: (id: number) => void;
}

const UnitServices = (axiosInstance: AxiosInstance): TServices => {
  const unitUrl = "/unit";
  return {
    findMany: async (search, skip, take) => {
      return await axiosInstance
        .get(`${unitUrl}?take=${take}&skip=${skip}`, {
          params: search,
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },

    create: async (data: ITUnitCreateInput) => {
      const req = {
        ...data,
      };
      return await axiosInstance
        .post(`${unitUrl}`, req)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },
    update: async (id: number, data: ITUnitCreateInput) => {
      const req = {
        ...data,
      };
      return await axiosInstance
        .patch(`${unitUrl}/${id}`, req)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return err;
        });
    },
    delete: async (id: number) => {
      return await axiosInstance.delete(`${unitUrl}/${id}`);
    },
  };
};
export default UnitServices;
