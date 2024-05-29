import { AxiosInstance } from "axios";
const ConfigsServices = (axiosInstance: AxiosInstance) => {
  const userUrl = "/user";
  const locationUrl = "/location";
  const inventoryUrl = "/inventory";

  return {
    getRequestUsers: async () => {
      return await axiosInstance
        .post(`${userUrl}/condition`, {
          condition: {
            where: { activeStatus: true, ownerGroupId: { not: null } },
            select: {
              id: true,
              userId: true,
              firstNameTh: true,
              lastNameTh: true,
              ownerGroup: { select: { groupId: true, groupName: true } },
            },
          },
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
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
export default ConfigsServices;
