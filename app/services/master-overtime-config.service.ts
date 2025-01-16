import { AxiosInstance } from "axios";
export interface TMasterOvertimeConfigService {
  findMasterOvertimeConfig: () => Promise<[]>;
  update: (values: {
    partTimeCondition: {
      index: {
        name: string;
        index: number;
        intime: number;
        endTime: string;
        startOt: string;
        overtime: number;
        typeDate: string;
        breakTime: number;
        startTime: string;
      };
    };
  }) => Promise<[]>;
}

export const MasterOvertimeConfigService = (axiosInstance: AxiosInstance): TMasterOvertimeConfigService => {
  const basrUrlmasterOvertimeConfig = "/master-config-ot";
  return {
    findMasterOvertimeConfig: async () => {
      const result = await axiosInstance.get(`${basrUrlmasterOvertimeConfig}`);
      return result?.data || [];
    },
    update: async (values: {
      partTimeCondition: {
        index: {
          name: string;
          index: number;
          intime: number;
          endTime: string;
          startOt: string;
          overtime: number;
          typeDate: string;
          breakTime: number;
          startTime: string;
        };
      };
    }) => {
      console.log("test");

      const result = await axiosInstance.patch(`${basrUrlmasterOvertimeConfig}/0`, values);
      return result?.data || [];
    },
  };
};
