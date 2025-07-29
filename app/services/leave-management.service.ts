import { AxiosInstance } from "axios";
import { ITpyeUser, ITypeDataLeave } from "../page/leave-control-management/common";
import { Dayjs } from "dayjs";

const LeaveManagementServices = (axiosInstance: AxiosInstance) => {
  const baseUrlTypeleave = "/master-type-leave";
  const baseUrlTypeleaveMap = "/tpye-data-leave-map";
  const baseUrlUser = "/user";
  const baseUrlDataLeave = "/data-leave";
  const baseUrlDataLeaveFile = "/data-leave-file";
  const basrUrIDepartment = "/department";
  const baseReportDataleave = "report-data-leave";

  return {
    countDataLeaveRange: async (
      userId: string,
      TypeId: number,
      startDate: Date | Dayjs,
      endDate: Date | Dayjs,
      startTime: string,
      endTime: string,
    ) => {
      const url = `${baseUrlDataLeave}/check-data-range`;
      const params = {
        userId,
        TypeId,
        startDate,
        endDate,
        startTime,
        endTime,
      };
      return await axiosInstance
        .get(url, { params })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return [];
        });
    },
    getdataAll: async () => {
      return await axiosInstance
        .get(`${baseUrlTypeleave}/condition`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return [];
        });
    },
    getdataUserAll: async () => {
      return await axiosInstance
        .get(`${baseUrlUser}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return [];
        });
    },
    getdataLeaveUserById: async (values: any) => {
      const condition = {
        ...values,
      };
      return await axiosInstance
        .get(`${baseUrlDataLeave}/condition`, {
          params: condition,
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return [];
        });
    },
    getdataLeaveCalendarTeamsByMonth: async (month: Date | string | Dayjs) => {
      const condition = {
        month,
      };
      return await axiosInstance
        .get(`${baseUrlDataLeave}/calendar-teams`, {
          params: condition,
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return [];
        });
    },
    getdataLeaveCalendarByMonth: async (month: Date | string | Dayjs) => {
      const condition = {
        month,
      };
      return await axiosInstance
        .get(`${baseUrlDataLeave}/calendar`, {
          params: condition,
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return [];
        });
    },
    getdataLeaveAll: async (userId: string, skip: number, take: number) => {
      return await axiosInstance
        .get(`${baseUrlDataLeave}/${userId}?take=${take}&skip=${skip}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return [];
        });
    },
    getdataLeavefindBygroup: async (userId: string, params: any, skip: number | null, take: number | null) => {
      let filter = "";
      if (skip && take) {
        filter = `?take=${take}&skip=${skip}`;
      }
      return await axiosInstance
        .get(`${baseUrlDataLeave}/findGroup/${userId}`, { params: params })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return [];
        });
    },
    getdataLeaveHrfindBygroup: async (userId: string, params: any, skip: number, take: number) => {
      return await axiosInstance
        .get(`${baseUrlDataLeave}/findGroup-hr/${userId}?take=${take}&skip=${skip}`, { params: params })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return [];
        });
    },
    getdataUserByTypeLeaveId: async (search: { typeid: string }) => {
      const condition = {
        where: {
          id: Number(search.typeid),
        },
        select: {
          typeLeaveDisabledMap: {
            select: {
              id: true,
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

    getdataMasterTypeLeaveByTypeId: async (typeId: number) => {
      return await axiosInstance
        .get(`${baseUrlTypeleave}/${typeId}`)
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

    // getdataLeaveByUserId: async (userId: string | undefined) => {
    //   let url = `${baseUrlDataLeave}/leave-header/${userId}`;
    //   return await axiosInstance
    //     .get(url)
    //     .then((res) => {
    //       return res.data;
    //     })
    //     .catch((err) => {
    //       return;
    //     });
    // },
    getHeaderByUserId: async () => {
      let url = `${baseUrlDataLeave}/leave-header`;
      return await axiosInstance
        .get(url)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return;
        });
    },

    findUserByUserId: async (userId: string | undefined) => {
      let url = `${baseUrlDataLeave}/find-user-by-userId/${userId}`;
      return await axiosInstance
        .get(url)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return [];
        });
    },

    findDetailTypeLeaveByUserId: async (userId: string | undefined) => {
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

    getdataTypeLeaveMap: async (user_id: number, masterTypeleaveId: string) => {
      const condition = {
        userId: user_id,
        masterTypeleaveId: masterTypeleaveId,
      };
      return await axiosInstance
        .get(`${baseUrlTypeleaveMap}/condition`, {
          params: condition,
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return;
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
          condition,
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

    approvedDataLeave: async (detailApproved: string, event: string, id: number, data: any, typeLeave: string) => {
      const condition = {
        where: {
          id: id,
        },
        data: {
          typeLeave,
          status: event,
          userApproved: `${data.firstNameTh} ${data.lastNameTh}`,
          approvedDate: new Date(),
          detailApproved,
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

    deleteTypeLeaveDisabled: async (id: number) => {
      return await axiosInstance
        .delete(`${baseUrlTypeleaveMap}/${id}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    deleteDataLeave: async (id: number) => {
      return await axiosInstance
        .delete(`${baseUrlDataLeave}/${id}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    findDetailDepartment: async () => {
      return await axiosInstance
        .get(`${basrUrIDepartment}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getdataDepartmentId: async () => {
      const condition = {
        select: {
          departId: true,
        },
      };
      return await axiosInstance
        .post(`${basrUrIDepartment}/conditionId`, {
          condition: condition,
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return [];
        });
    },

    getUserGroupByGroupId: async (groupId: string) => {
      const condition = {
        where: {
          groupId: groupId,
        },
        select: {
          id: true,
          groupId: true,
          groupName: true,
          headId: true,
        },
      };
      return await axiosInstance
        .post(`/user-group/condition-first`, {
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

    getUsersByUserId: async (userId: string) => {
      const condition = {
        where: { userId: userId },
        select: {
          userId: true,
          username: true,
          firstNameTh: true,
          lastNameTh: true,
          firstNameEn: true,
          lastNameEn: true,
          email: true,
          phoneNumber: true,
          ownerGroupId: true,
        },
      };
      return await axiosInstance
        .post(`${baseUrlUser}/condition-first`, { condition: condition })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    getUserGroupMapPermission: async () => {
      return await axiosInstance
        .get(`/user-group-map-permission/`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    exportReport: async (req: { search: object }) => {
      return await axiosInstance
        .get(`${baseReportDataleave}/export`, { params: req.search, responseType: "blob" })
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
export default LeaveManagementServices;
