import { AxiosInstance } from "axios";
import { TCreateUserDto, TUserAllDto } from "../page/users-management/users/common";

export interface TUsersService {
  findAllUser: (search: {}) => Promise<{ data: TUserAllDto[]; total: number }>;
  validateUsername: (username: string, selectUserType: string) => Promise<any>;
  validateEmail: (email: string, type: string) => Promise<any>;
  validatePassword: (password: string) => Promise<any>;
  findGroupsId24: () => Promise<any>;
  findByToken: () => Promise<any>;
  addUser: (formData: TCreateUserDto) => Promise<any>;
  updateUser: (userId: string, formData: TCreateUserDto) => Promise<any>;
  uploadFiles: (userId: string, form: any) => Promise<any>;
  getImage: (userId: string) => Promise<any>;
  findAssignGroup: (userId: string, organizeId: string) => Promise<any>;
  findOwnerGroupByOrganizeId: (userId: string, organizeId: string) => Promise<any>;
  processAfterLoginAuth: () => Promise<any>;
}

export const UsersServices = (axiosInstance: AxiosInstance): TUsersService => {
  const baseUrl = "/id24users";
  const userurl = "/user";

  return {
    findAllUser: async (search) => {
      const result = await axiosInstance.get(`${baseUrl}`, { params: search });
      return result?.data || [];
    },
    validateUsername: async (username, type) => {
      return await axiosInstance.post(`${baseUrl}/check-id`, { username: username, type: type }).then((response) => response.data.message);
    },
    validateEmail: async (email, type) => {
      return await axiosInstance.post(`${baseUrl}/check-id`, { email: email, type: type }).then((response) => response.data.message);
    },
    validatePassword: async (password) => {
      return await axiosInstance.post(`${baseUrl}/validate/password`, { password: password }).then((response) => response.data);
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
    uploadFiles: async (UserId: string, form: any) => {
      return await axiosInstance
        .post(`${baseUrl}/${UserId}`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((result) => result.data)
        .catch((err) => err);
    },

    getImage: async (userId) => {
      try {
        return await axiosInstance
          .get(`${userurl}/upload-image/${userId}`, { responseType: "blob" })
          .then((result) => {
            return result.data;
          })
          .catch((err) => err);
      } catch (err) {
        console.log(err);
      }
    },
    findByToken: async () => {
      return await axiosInstance.get(`${baseUrl}/findbytoken`).then((result) => result.data);
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
    processAfterLoginAuth: async () => {
      return await axiosInstance.get(`${baseUrl}/process-after-login-auth`).then((result) => result.data);
    },
  };
};
