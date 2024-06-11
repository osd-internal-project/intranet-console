import { AxiosInstance } from "axios";
import { Filtertypeleave, ITypetypeleave, ITypetypeleaveUpadte } from "../common";
const DataLeaveService = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/master-type-leave";
  const baseUrlTypeleave = "/master-type-leave";
  const baseUrlTypeleaveMap = "/tpye-data-leave-map";
  const baseUrlUser = "/user";

  return {
    getdataAll: async () => {
      const condition = {
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
    getdataUserAll: async () => {
      const condition = {
        orderBy: { id: "asc" },
      };
      return await axiosInstance
        .post(`${baseUrlUser}/condition`, {
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
    getdataUserByTypeLeaveId: async (id: any) => {
      const condition = {
        where: {
          id: Number(id.typeid),
        },
        select: {
          typeLeaveDisabledMap: {
            select: {
              user: true,
            },
          },
        },
        orderBy: { id: "asc" },
      };
      return await axiosInstance
        .post(`${baseUrlTypeleave}/conditionId`, {
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
    getdataTypeLeaveAll: async (search: Filtertypeleave) => {
      const condition = {
        where: search,
        orderBy: { id: "asc" },
      };
      return await axiosInstance
        .post(`${baseUrlTypeleave}/condition`, {
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
    createTypeLeaveDisabled: async (event: any) => {
      const condition = {
        data: {
          ...event,
        },
      };
      return await axiosInstance
        .post(`${baseUrlTypeleaveMap}`, {
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
  };
};
export default DataLeaveService;
