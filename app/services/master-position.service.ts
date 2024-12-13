import { AxiosInstance } from "axios";
import { ITypeOption } from "../page/inventory/common";

export interface TMasterPositionService {
  findAllPosition: () => Promise<ITypeOption[]>;
}

export const MasterPositionServices = (axiosInstance: AxiosInstance): TMasterPositionService => {
  const baseUrl = "/master-position";
  return {
    findAllPosition: async () => {
      const result = await axiosInstance.get(`${baseUrl}`);
      return result?.data || [];
    },
  };
};
