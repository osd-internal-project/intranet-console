import { AxiosInstance } from "axios";
const IndexServices = (axiosInstance: AxiosInstance) => {
  const locationUrl = "/location";
  const inventoryLotUrl = "/inventory-lot";
  const userurl = "/user";
  return {
    countLotBeforeExpiredByLocation: async (group: string[]) => {
      return await axiosInstance
        .post(`${inventoryLotUrl}/count-before-expired`, {
          group: group,
        })
        .then((result) => result.data)
        .catch((err) => err);
    },
    getImage: async (userId: string) => {
      return await axiosInstance
        .get(`${userurl}/upload-image/${userId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
  };
};

export default IndexServices;
