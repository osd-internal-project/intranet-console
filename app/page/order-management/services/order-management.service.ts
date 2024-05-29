import { AxiosInstance } from "axios";
import { ITypeMasterProduct, ITypeOrder, ITypeOrderForm, ITypeOrderLot, ITypeOrderLotForm } from "../common";
const OrderManagementServices = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/order";
  const masterdataApiOrderLot = "/order-lot";
  const masterObjectiveUrl = "/master-objective";
  const locationUrl = "/location";
  const masterdataApiInventoryLot = "/inventory-lot";
  return {
    getLocationByGroup: async (userGroup: string[]) => {
      return await axiosInstance
        .post(`${locationUrl}/find-by-user-group`, { userGroup: userGroup })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    getMasterObjectiveAll: async () => {
      return await axiosInstance
        .post(`${masterObjectiveUrl}/condition`, { condition: { where: { status: true } } })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findAll: async () => {
      return await axiosInstance
        .get(`${baseUrl}`)
        .then((result) => result.data)
        .catch((err) => err);
    },
    findByCondition: async (department: Number, filters: any) => {
      const condition = {
        where: { locationId: department, ...filters },
      };
      return await axiosInstance
        .post(`${baseUrl}/condition`, {
          condition: condition,
        })
        .then((result) => result.data)
        .catch((err) => err);
    },
    findDetailByid: async (id: number) => {
      const condition = { where: { id: id }, include: { orderLot: true } };
      return await axiosInstance
        .post(`${baseUrl}/condition-first`, {
          condition: condition,
        })
        .then((result) => result.data)
        .catch((err) => err);
    },
    findOrdersByDepartment: async (department: Number, filters: any) => {
      const condition = {
        where: { locationId: department, orderLot: { some: { ...filters } } },
        include: { orderLot: true },
      };
      return await axiosInstance
        .post(`${baseUrl}/condition`, {
          condition: condition,
        })
        .then((result) => result.data)
        .catch((err) => err);
    },
    findOrdersAllByOwnerGroup: async (grouplist: string[], filters: any) => {
      const condition = {
        where: { ownerGroup: { in: grouplist }, orderLot: { some: { ...filters } } },
        include: { orderLot: true },
      };
      return await axiosInstance
        .post(`${baseUrl}/condition`, {
          condition: condition,
        })
        .then((result) => result.data)
        .catch((err) => err);
    },

    findLotByOrderId: async (orderId: Number) => {
      const condition = {
        where: { orderId: orderId },
      };
      return await axiosInstance
        .post(`${masterdataApiOrderLot}/condition`, {
          condition: condition,
        })
        .then((result) => result.data)
        .catch((err) => err);
    },
    getLocation: async () => {
      return await axiosInstance
        .post(`${locationUrl}/condition`, { condition: { where: { status: true } } })
        .then((result) => result.data)
        .catch((err) => console.log(err));
    },
    create: async (data: ITypeOrderForm, orderLots: ITypeOrderLotForm[]) => {
      return await axiosInstance
        .post(`${baseUrl}/`, { data: data, orderLots: orderLots })
        .then((result) => result.data)
        .catch((err) => console.log(err));
    },
    getOrderLotsByInventoryID: async (inventoryID: number, expiredStatus: boolean, difLotId: number[], search: object) => {
      const condition = {
        inventoryId: Number(inventoryID),
        condition: search,
        expiredStatus: expiredStatus,
        difLotId: difLotId,
      };
      return await axiosInstance
        .post(`${masterdataApiInventoryLot}/find-by-inventory`, condition)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getUsableRemain: async (inventorystockId: number) => {
      return await axiosInstance
        .get(`${masterdataApiInventoryLot}/find-usable-remain-by-inventorystock?stockid=${inventorystockId}`)
        .then((result) => result.data)
        .catch((err) => console.log(err));
    },
    getExpiredRemain: async (inventorystockId: number) => {
      return await axiosInstance
        .get(`${masterdataApiInventoryLot}/find-expired-remain-by-inventorystock?stockid=${inventorystockId}`)
        .then((result) => result.data)
        .catch((err) => console.log(err));
    },
    updateStaus: async (id: number, status: string) => {
      return await axiosInstance
        .patch(`${baseUrl}/update-status`, { id: id, status: status })
        .then((result) => result.data)
        .catch((err) => console.log(err));
    },
  };
};

export default OrderManagementServices;
