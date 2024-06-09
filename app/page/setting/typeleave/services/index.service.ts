import { AxiosInstance } from "axios";
import { Filtertypeleave, ITypetypeleave, ITypetypeleaveUpadte } from "../common";
const MasterTypeLeaveService = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/master-type-leave";
  return {
    getdataAll: async (search: Filtertypeleave) => {
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
    createTypeleave: async (event: ITypetypeleave) => {
      const condition = {
        ...event,
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
    updateTypeleave: async (event: ITypetypeleaveUpadte) => {
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
    deleteTypeleave: async (event: number) => {
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
export default MasterTypeLeaveService;
