import { AxiosInstance } from "axios";
import { Dayjs } from "dayjs";
import { ITOrder, ITOrderCreateInput, ITOrderLot, ITOrderLotCreateInput, ITOrderLotUpdateInput, ITOrderUpdateInput } from "../common/order";
interface TServices {
  findManyOrder: (search: { createdAt?: Dayjs | string | null }, skip: number, take: number) => Promise<{ data: ITOrder[]; count: number }>;
  findManyOrderLot: (
    search: { oderId?: string; createdAt?: Dayjs | string | null },
    skip: number,
    take: number,
  ) => Promise<{ data: ITOrderLot[]; count: number }>;
  findOneOrder: (prdId: string) => Promise<ITOrder>;
  findOneOrderLot: (barcode: string) => Promise<ITOrderLot>;
  createOrder: (data: ITOrderCreateInput) => Promise<ITOrder>;
  updateOrder: (id: number, data: ITOrderUpdateInput) => Promise<ITOrder>;
  deleteOrder: (id: number) => Promise<number>;
  createOrderLot: (data: ITOrderLotCreateInput) => Promise<ITOrderLot>;
  updateOrderLot: (id: number, data: ITOrderLotUpdateInput) => Promise<ITOrderLot>;
  deleteOrderLot: (id: number) => Promise<number>;
}

const OrderServices = (axiosInstance: AxiosInstance): TServices => {
  const orderUrl = "/order";
  const orderLotUrl = "/order-lot";

  return {
    findManyOrder: async (search, skip, take) => {
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
    findManyOrderLot: async (search, skip, take) => {
      return await axiosInstance
        .get(`${orderLotUrl}?take=${take}&skip=${skip}`, {
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
    findOneOrder: async (prdId) => {
      return await axiosInstance
        .get(`${orderUrl}/${prdId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },
    findOneOrderLot: async (barcode) => {
      return await axiosInstance
        .get(`${orderLotUrl}/${barcode}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },
    createOrder: async (data) => {
      const req = {
        ...data,
      };
      return await axiosInstance
        .post(`${orderUrl}`, req)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },
    updateOrder: async (id: number, data) => {
      const req = {
        ...data,
      };
      return await axiosInstance
        .patch(`${orderUrl}/${id}`, req)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return err;
        });
    },
    deleteOrder: async (id: number) => {
      return await axiosInstance.delete(`${orderUrl}/${id}`);
    },
    createOrderLot: async (data) => {
      const req = {
        ...data,
      };
      return await axiosInstance
        .post(`${orderLotUrl}`, req)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },
    updateOrderLot: async (id, data) => {
      const req = {
        ...data,
      };
      return await axiosInstance
        .patch(`${orderLotUrl}/${id}`, req)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return err;
        });
    },
    deleteOrderLot: async (id: number) => {
      return await axiosInstance.delete(`${orderLotUrl}/${id}`);
    },
  };
};
export default OrderServices;
