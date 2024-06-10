import { AxiosInstance } from "axios";
import { ITypeMasterdataHolidys, ITypeMasterdataHolidysUpadte, FilterMasterdataHolidys } from "../common";
const MasterHolidaysService = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/master-holidays";
  return {
    getdataAll: async (search: FilterMasterdataHolidys) => {
      const condition = {
        where: search,
        orderBy: { id: "asc" },
      };
      return await axiosInstance
        .post(`${baseUrl}/condition`, {
          condition: condition,
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    createMasterHolidays: async (event: ITypeMasterdataHolidys) => {
      const condition = {
        data: {
          ...event,
        },
      };
      return await axiosInstance
        .post(`${baseUrl}`, {
          condition: condition,
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    updateMasterHolidays: async (event: ITypeMasterdataHolidysUpadte) => {
      return await axiosInstance
        .patch(`${baseUrl}`, {
          condition: event,
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    deleteMasterHolidays: async (event: number) => {
      return await axiosInstance
        .delete(`${baseUrl}/${event}`)
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
export default MasterHolidaysService;
