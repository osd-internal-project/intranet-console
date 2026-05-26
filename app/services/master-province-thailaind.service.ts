import { AxiosInstance } from "axios";
export interface TMasterProvinceThailandService {
  findAll: () => Promise<
    {
      id: number;
      provinceId: string;
      nameProvinceTH: string;
      createdAt: string | Date;
      updatedAt: string | Date;
    }[]
  >;
}

export const MasterProvinceThailandServices = (axiosInstance: AxiosInstance): TMasterProvinceThailandService => {
  const basrUrl = "/master-province-thailand";
  return {
    findAll: async () => {
      const result = await axiosInstance.get(`${basrUrl}`);
      return result?.data || [];
    },
  };
};
