import { AxiosInstance } from "axios";
import { ITSelectUsers } from "@/app/common/customer";
export interface TUserServices {
  findUsersFormEngineerProjectModule: () => Promise<ITSelectUsers[]>;
  findUsersFormSaleProjectModule: () => Promise<ITSelectUsers[]>;
  findHeaderUserByUserId: (userId: string) => Promise<ITUser[]>;
  findUsersByOwnerGroupIds: (userGroupId: string[]) => Promise<any>;
}
const UserServices = (axiosInstance: AxiosInstance): TUserServices => {
  //User Service
  const userUrl = "/user";
  return {
    findUsersFormEngineerProjectModule: async () => {
      return await axiosInstance
        .get(`${userUrl}/find-users-form-engineerproject-module/`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    },
    findUsersFormSaleProjectModule: async () => {
      return await axiosInstance
        .get(`${userUrl}/find-users-form-saleproject-module/`)
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
    findUsersByOwnerGroupIds: async (userGroupId) => {
      return await axiosInstance
        .post(`${userUrl}/users-in-owner-groups`, { groups: userGroupId })
        .then((result) => result.data)
        .catch((err) => err);
    },
  };
};

export default UserServices;
