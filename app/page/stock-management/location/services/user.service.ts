import { AxiosInstance } from "axios";
// import { ITypeCreateBodyBrands } from "../common";

export const UserServices = (axiosInstance: AxiosInstance) => {
  const apiListUserGroup = "/user-group";
  return {
    getUserGroupAll: async () => {
      return await axiosInstance.post(`${apiListUserGroup}/condition`, {
        condition: {},
      });
    },
  };
};
