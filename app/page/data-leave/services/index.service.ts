import { AxiosInstance } from "axios";
import { Filtertypeleave, ITpyeUser, ITypeDataLeave, ITypeDataLeaveCreate } from "../common";
const DataLeaveService = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/master-type-leave";
  const baseUrlTypeleave = "/master-type-leave";
  const baseUrlTypeleaveMap = "/tpye-data-leave-map";
  const baseUrlUser = "/user";
  const baseUrlDataLeave = "/data-leave";

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
          return [];
        });
    },
    getdataLeaveByuserID: async (userId: string) => {
      const condition = {
        where: {
          userId: userId,
        },
        orderBy: { id: "asc" },
      };
      return await axiosInstance
        .post(`${baseUrlDataLeave}/condition`, {
          condition: condition,
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return [];
        });
    },
    getdataUserByTypeLeaveId: async (id: ITpyeUser) => {
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
          return [];
        });
    },
    createTypeLeaveDisabled: async (event: ITpyeUser) => {
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
          return [];
        });
    },
    createDataLeave: async (event: ITypeDataLeave) => {
      const condition = {
        data: {
          ...event,
        },
      };
      return await axiosInstance
        .post(`${baseUrlDataLeave}`, {
          condition: condition,
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return [];
        });
    },
    deleteTypeLeaveDisabled: async (event: number) => {
      return await axiosInstance
        .delete(`${baseUrlTypeleaveMap}/${event}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return [];
        });
    },
  };
};
export default DataLeaveService;
