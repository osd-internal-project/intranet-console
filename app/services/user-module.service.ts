import { AxiosInstance } from "axios";
import { ITUserModule, ITUserModuleForm } from "../common/user-module";
interface TServices {
  findMany: (search: any) => Promise<ITUserModule[]>;
  findFirst: (id: number) => Promise<ITUserModule>;
  create: (data: ITUserModuleForm) => Promise<ITUserModule>;
  update: (id: number, data: ITUserModuleForm) => Promise<ITUserModule>;
  delete: (id: number) => any;
}

const UserModuleServices = (axiosInstance: AxiosInstance): TServices => {
  const baseUrl = "/user-module";
  return {
    findMany: async (search: any) => {
      return await axiosInstance
        .get(`${baseUrl}/`, {
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
    create: async (data: ITUserModuleForm) => {
      const req = {
        data: data,
      };
      return await axiosInstance
        .post(`${baseUrl}/`, req)
        .then((res) => {
          return res.data;
        });
    },
    update: async (id: number, data: ITUserModuleForm) => {
      const req = {
        data: data,
      };
      return await axiosInstance
        .patch(`${baseUrl}/${id}`, req)
        .then((res) => {
          return res.data;
        });
    },
    delete: async (id: number) => {
      return await axiosInstance.delete(`${baseUrl}/${id}`);
    },
  };
};
export default UserModuleServices;
