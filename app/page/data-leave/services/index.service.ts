import { AxiosInstance } from "axios";
import {
  Filtertypeleave,
  ITpyeUser,
  ITypeDataLeave,
  ITypeDataLeaveCreate,
} from "../common";
const DataLeaveService = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/master-type-leave";
  const baseUrlTypeleave = "/master-type-leave";
  const baseUrlTypeleaveMap = "/tpye-data-leave-map";
  const baseUrlUser = "/user";
  const baseUrlDataLeave = "/data-leave";
  const baseUrlDataLeaveFile = "/data-leave-file";
  const basrUrIDepartment = "/department";
  const basrUrIUserGroup = "/user-group";

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
    getdataLeaveByuserId: async (userId: string) => {
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
    getdataLeaveUserById: async (userId: number) => {
      const condition = {
        where: { userId: userId },
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
    getdataLeaveById: async (id: number) => {
      const condition = {
        where: { id: id },
      };
      return await axiosInstance
        .post(`${baseUrlDataLeave}/condition`, {
          condition: condition,
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return;
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
    getdataLeaveGroupById: async (groupId: string) => {
      const condition = {
        where: { groupId: groupId },
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
    // getdataLeaveByUserId: async (userId: string | undefined) => {
    // console.log('userId:', userId);

    //   // const condition = {
    //   //   // where: { groupId: userId },
    //   //   where: { userId: userId },
    //   //   // orderBy: { id: "asc" },
    //   // };
    //   return await axiosInstance
    //     .get(`${baseUrlDataLeave}/leave/user/${userId}`, {
    //       // condition: condition,
    //     })
    //     .then((res) => {
    //       return res.data;
    //     })
    //     .catch((err) => {
    //       return [];
    //     });
    // },
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

    getdataUserByIdTypeLeave: async () => {
      const condition = {
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

    getdataLeaveByUserId: async (userId: string | undefined) => {
      let url = `${baseUrlDataLeave}/leave-header/${userId}`;
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

    getdataTypeLeaveMap: async (user_id: any) => {
      const condition = {
        where: {
          userId: user_id,
        },
      };
      return await axiosInstance
        .post(`${baseUrlTypeleaveMap}/condition`, {
          condition: condition,
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
          // createdAt: true,
          // parentGroupId: true,
          // organizedGroupId: true,
          // description: true,
          // userGroupUserRoleMap: true,
          // engineerUserGroupId: true,
          // engineerUsersId: true,
          // user: true,
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
          // activeStatus: true,
          // clientId: true,
          // createdAt: true,
          // updatedAt: true,
          // positionId: true,
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

    getUserGroupMapHeader: async () => {
      return await axiosInstance
        .get(`/user-group-map-header/`)
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
