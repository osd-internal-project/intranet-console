import { AxiosInstance } from "axios";

const StockServices = (axiosInstance: AxiosInstance) => {
  const locationUrl = "/location";
  const inventoryUrl = "/inventory";
  return {
    getLocation: async () => {
      return await axiosInstance
        .post(`${locationUrl}/condition`, { condition: { where: { status: true } } })
        .then((result) => result.data)
        .catch((err) => console.log(err));
    },
    getInventoryByLocationId: async (locationId: number) => {
      return await axiosInstance
        .post(`${inventoryUrl}/condition`, { condition: { where: { status: true, locationId: locationId } } })
        .then((result) => result.data)
        .catch((err) => console.log(err));
    },
  };
};

export default StockServices;
