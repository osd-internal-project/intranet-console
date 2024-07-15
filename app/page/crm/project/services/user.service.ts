import { AxiosInstance } from "axios";
import { ITSelectUsers } from "../common";
export interface TCrmServices {
  findOrganizeUserByUserId: (userId: string) => Promise<ITSelectUsers[]>;
  getUserGroupFormOrganizedByUserId: (userId: string) => Promise<any>;
  findUsersByOwnerGroup: (group: string[]) => Promise<ITSelectUsers[]>;
}
const UserServices = (axiosInstance: AxiosInstance): TCrmServices => {
  //User Service
  const userUrl = "/user";
  const userGroupUrl = "/user-group";

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
    getUserGroupFormOrganizedByUserId: async (userId: string) => {
      return await axiosInstance
        .get(`${userGroupUrl}/find-group-by-user/${userId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findUsersByOwnerGroup: async (ownerGroup: string[]) => {
      return await axiosInstance
        .get(`${userUrl}/find-users-by-ownergroup/`, {
          params: ownerGroup,
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

export default UserServices;
