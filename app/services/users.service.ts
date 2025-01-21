import { AxiosInstance } from "axios";
import {
  TCreateUserDto,
  TUserAllDto,
} from "../page/users-management/users/common";

export interface TUsersService {
  findAllUser: (search: {}) => Promise<{ data: TUserAllDto[]; total: number }>;
  validateUsername: (username: string, selectUserType: string) => Promise<any>;
  validateEmail: (email: string, type: string) => Promise<any>;
  validatePassword: (password: string) => Promise<any>;
  findGroupsId24: () => Promise<any>;
  findByToken: () => Promise<any>;
  addUser: (formData: TCreateUserDto) => Promise<any>;
  updateUser: (userId: string, formData: TCreateUserDto) => Promise<any>;
  findAssignGroup: (userId: string, organizeId: string) => Promise<any>;
  findOwnerGroupByOrganizeId: (
    userId: string,
    organizeId: string
  ) => Promise<any>;
}

export const UsersServices = (axiosInstance: AxiosInstance): TUsersService => {
  const baseUrl = "/id24users";
  return {
    findAllUser: async (search) => {
      const result = await axiosInstance.get(`${baseUrl}`, { params: search });
      return result?.data || [];
    },
    validateUsername: async (username, type) => {
      return await axiosInstance
        .post(`${baseUrl}/check-id`, { username: username, type: type })
        .then((response) => response.data.message);
    },
    validateEmail: async (email, type) => {
      return await axiosInstance
        .post(`${baseUrl}/check-id`, { email: email, type: type })
        .then((response) => response.data.message);
    },
    validatePassword: async (password) => {
      return await axiosInstance
        .post(`${baseUrl}/validate/password`, { password: password })
        .then((response) => response.data);
    },
    findGroupsId24: async () => {
      return await axiosInstance
        .get(`${baseUrl}/groups`)
        .then((result) => result.data)
        .catch((err) => err);
    },
    addUser: async (formData: TCreateUserDto) => {
      return await axiosInstance
        .post(`${baseUrl}`, formData)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    updateUser: async (userId, formData: TCreateUserDto) => {
      return await axiosInstance
        .patch(`${baseUrl}/${userId}`, formData)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findByToken: async () => {
      return await axiosInstance
        .get(`${baseUrl}/findByToken`)
        .then((result) => result.data);
    },
    findAssignGroup: async (userId, organizeId) => {
      return await axiosInstance
        .get(`${baseUrl}/assign-groups/${userId}/${organizeId}`)
        .then((result) => result.data)
        .catch((err) => err);
    },
    findOwnerGroupByOrganizeId: async (userId, organizeId) => {
      return await axiosInstance
        .get(`${baseUrl}/assign-owner-groups/${userId}/${organizeId}`)
        .then((result) => result.data)
        .catch((err) => err);
    },
  };
};
