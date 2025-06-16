import { AxiosInstance } from "axios";

export interface TMasterPositionService {
  findAllPosition: () => Promise<any[]>;
  findAllDepartment: () => Promise<any[]>;
}

export const MasterPositionServices = (axiosInstance: AxiosInstance): TMasterPositionService => {
  const baseUrl = "/master-position";
  const baseUrlDepartment = "/department";

  return {
    findAllPosition: async () => {
      const result = await axiosInstance.get(`${baseUrl}`);
      return result?.data || [];
    },
    findAllDepartment: async () => {
      return await axiosInstance
        .get(`${baseUrlDepartment}`)
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
