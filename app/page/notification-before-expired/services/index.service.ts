import { AxiosInstance } from "axios";
import { ITypeDataTable } from "../common";
const NotificationBeforeExpiredServices = (axiosInstance: AxiosInstance) => {
  const locationUrl = "/location";
  const inventoryLotUrl = "/inventory-lot";
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

    findLotBeforeExpiredByLocation: async (location: number[]) => {
      return await axiosInstance
        .post(`${inventoryLotUrl}/find-before-expired`, {
          location: location,
        })
        .then((result) => result.data)
        .catch((err) => err);
    },
  };
};

export default NotificationBeforeExpiredServices;
