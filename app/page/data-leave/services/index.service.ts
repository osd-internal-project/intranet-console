import { AxiosInstance } from "axios";
import { Filtertypeleave, ITpyeUser, ITypeDataLeave, ITypeDataLeaveCreate } from "../common";
const DataLeaveService = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/master-type-leave";
  const baseUrlTypeleave = "/master-type-leave";
  const baseUrlTypeleaveMap = "/tpye-data-leave-map";
  const baseUrlUser = "/user";
  const baseUrlDataLeave = "/data-leave";
  const baseUrlDataLeaveFile = "/data-leave-file";

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
        where: { userId: userId },
        include: {
          dataLeaveFiles: true,
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
    getdataLeaveAll: async () => {
      const condition = {
        include: {
          dataLeaveFiles: true,
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
    getOwnerGroupsByPositionId: async (PositionId: string) => {
      return await axiosInstance
        .get(`${baseUrlUser}/find-owner-users/${PositionId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return [];
        });
    },
    findDetailTypeLeaveByUserId: async (
      userId: string | undefined,
      params: { typeId: string; startDate: any; startTime: any; endDate: any; endTime: any },
    ) => {
      let url = `${baseUrlDataLeave}/find-detail-type-leave-by-userId/${userId}`;

      return await axiosInstance
        .get(url)
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
    uploadFiles: async (id: number, form: any) => {
      return await axiosInstance
        .post(`${baseUrlDataLeaveFile}/${id}`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((result) => result.data)
        .catch((err) => err);
    },
    approvedDataLeave: async (event: string, id: number, data: any) => {
      const condition = {
        where: {
          id: id,
        },
        data: {
          status: event,
          userApproved: `${data.firstNameTh} ${data.lastNameTh}`,
          approvedDate: new Date(),
        },
      };
      return await axiosInstance
        .patch(`${baseUrlDataLeave}/${id}`, {
          condition: condition,
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return [];
        });
    },
    downloadFile: async (id: number) => {
      return await axiosInstance
        .get(`${baseUrlDataLeaveFile}/get-file/${id}`, { responseType: "blob" })
        .then((result) => {
          return result.data;
        })
        .catch((err) => console.log(err));
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
