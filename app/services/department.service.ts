import { AxiosInstance } from "axios";
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
