import { AxiosInstance } from "axios";
import { ITypeOption } from "../page/inventory/common";

export interface TMasterDepartmentService {
  findAllDepartment: () => Promise<[]>;
}

export const MasterDepartmentServices = (axiosInstance: AxiosInstance): TMasterDepartmentService => {
  const basrUrlDepartment = "/department";
  return {
    findAllDepartment: async () => {
      const result = await axiosInstance.get(`${basrUrlDepartment}`);
      return result?.data || [];
    },
  };
};
