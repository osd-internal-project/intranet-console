import { AxiosInstance } from "axios";
const OrderUserServices = (axiosInstance: AxiosInstance) => {
  const userUrl = "/user";
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
  };
};

export default OrderUserServices;
