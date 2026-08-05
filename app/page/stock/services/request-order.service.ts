import { AxiosInstance } from "axios";
import { Dayjs } from "dayjs";
import { ITCreateRequestOrderInput, ITRequestOrder } from "../common/request-order";
interface TServices {
  findMany: (search: { createdAt?: Dayjs | string | null }, skip: number, take: number) => Promise<{ data: ITRequestOrder[]; count: number }>;
  findOne: (requestId: string) => Promise<ITRequestOrder>;
  create: (data: ITCreateRequestOrderInput) => Promise<ITRequestOrder>;
  update: (requestId: number, data: ITCreateRequestOrderInput) => Promise<ITRequestOrder>;
  delete: (id: number) => Promise<number>;
}

const RequestOrderServices = (axiosInstance: AxiosInstance): TServices => {
  const orderUrl = "/request-order";

  return {
    findMany: async (search, skip, take) => {
      return await axiosInstance
        .get(`${orderUrl}?take=${take}&skip=${skip}`, {
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

    findOne: async (requestId) => {
      return await axiosInstance
        .get(`${orderUrl}/${requestId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },

    create: async (data) => {
      const req = {
        ...data,
      };
      return await axiosInstance
        .post(`${orderUrl}`, req)
        .then((res) => {
          return res.data;
        });
    },
    update: async (requestId: number, data) => {
      const req = {
        ...data,
      };
      return await axiosInstance
        .patch(`${orderUrl}/${requestId}`, req)
        .then((res) => {
          return res.data;
        });
    },
    delete: async (id: number) => {
      return await axiosInstance.delete(`${orderUrl}/${id}`);
    },
  };
};
export default RequestOrderServices;
