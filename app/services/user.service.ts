import { AxiosInstance } from "axios";
import { ITSelectUsers } from "@/app/common/customer";
export interface TUserServices {
  findOrganizeUserByUserId: (userId: string) => Promise<ITSelectUsers[]>;
  findSaleUserBySalePermission: (userId: string) => Promise<ITSelectUsers[]>;
  findHeaderUserByUserId: (userId: string) => Promise<any[]>;
}
const UserServices = (axiosInstance: AxiosInstance): TUserServices => {
  //User Service
  const userUrl = "/user";
  return {
    findOrganizeUserByUserId: async (userId) => {
      return await axiosInstance
        .get(`${userUrl}/find-organize-user-by-userid/${userId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    },
    findSaleUserBySalePermission: async (userId) => {
      return await axiosInstance
        .get(`${userUrl}/find-sale-user-by-sale-permission/${userId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    },
    findHeaderUserByUserId: async (userId) => {
      return await axiosInstance
        .get(`${userUrl}/header-user-by-userid/${userId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    },
  };
};

export default UserServices;
