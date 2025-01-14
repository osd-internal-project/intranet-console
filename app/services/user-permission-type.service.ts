import { AxiosInstance } from "axios";
import {
  ITUserPermissionType,
  ITUserPermissionTypeForm,
} from "../common/user-permission-type";
interface TServices {
  findMany: (search: any) => Promise<ITUserPermissionType[]>;
  findFirst: (id: number) => Promise<ITUserPermissionType>;
  create: (data: ITUserPermissionTypeForm) => Promise<ITUserPermissionType>;
  update: (
    id: number,
    data: ITUserPermissionTypeForm
  ) => Promise<ITUserPermissionType>;
  delete: (id: number) => any;
}

const UserPermissionTypeServices = (
  axiosInstance: AxiosInstance
): TServices => {
  const baseUrl = "/user-permission-type";
  return {
    findMany: async (search: any) => {
      return await axiosInstance
        .get(`${baseUrl}/many`, {
          params: search,
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findFirst: async (id: number) => {
      return await axiosInstance
        .post(`${baseUrl}/${id}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return undefined;
        });
    },
    create: async (data: ITUserPermissionTypeForm) => {
      const req = {
        data: data,
      };
      return await axiosInstance
        .post(`${baseUrl}/`, req)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return undefined;
        });
    },
    update: async (id: number, data: ITUserPermissionTypeForm) => {
      const req = {
        data: data,
      };
      return await axiosInstance
        .patch(`${baseUrl}/${id}`, req)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return undefined;
        });
    },
    delete: async (id: number) => {
      return await axiosInstance.delete(`${baseUrl}/${id}`);
    },
  };
};
export default UserPermissionTypeServices;
