import { AxiosInstance } from "axios";
const IndexServices = (axiosInstance: AxiosInstance) => {
  const locationUrl = "/location";
  const inventoryLotUrl = "/inventory-lot";
  return {
    countLotBeforeExpiredByDepartment: async (group: string[]) => {
      return await axiosInstance
        .post(`${inventoryLotUrl}/count-before-expired`, {
          group: group,
        })
        .then((result) => result.data)
        .catch((err) => err);
    },
  };
};

export default IndexServices;
