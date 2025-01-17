import { AxiosInstance } from "axios";
const UserGroupServices = (axiosInstance: AxiosInstance) => {
  const userUrl = "/user";
  return {
    getdataUserAll: async () => {
      const condition = {
        orderBy: { id: "asc" },
      };
      return await axiosInstance
        .post(`${userUrl}/condition`, {
          condition: condition,
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return [];
        });
    },
    getUserGroupAll: async () => {
      return await axiosInstance
        .post(`/user-group/condition`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getParentUserGroup: async () => {
      const condition = {
        where: {
          parentGroupId: null,
        },
      };
      return await axiosInstance
        .post(`/user-group/condition`, {
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
    getUserGroupByGroupId: async (groupId: string) => {
      const condition = {
        where: {
          groupId: groupId,
        },
        select: {
          id: true,
          groupId: true,
          groupName: true,
          createdAt: true,
          updatedAt: true,
          parentGroupId: true,
          organizedGroupId: true,
          description: true,
          userGroupUserRoleMap: true,
          saleUserGroupId: true,
          saleUsersId: true,
          engineerUserGroupId: true,
          engineerUsersId: true,
          user: true,
          headId: true,
          userGroupMapPermission: true,
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
    getUserGroupByOrganizedGroupId: async (organizedId: string) => {
      return await axiosInstance
        .get(`/user-group/${organizedId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getUserGroupMapPermission: async (condition: any) => {
      const req = {
        condition: condition,
      };
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
    getPermissionGroupByGroupIdAndModuleId: async (condition: {
      groupid: string;
      modulecode: string;
    }) => {
      return await axiosInstance
        .get(`/user-group/find-group-by-moduleid-and-groupid/`, {
          params: { condition },
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    addUserGroup: async (data: Object) => {
      const req = {
        data: data,
      };
      return await axiosInstance.post(`/user-group`, req);
    },

    updateUserGroup: async (groupId: string, data: Object) => {
      return await axiosInstance.patch(`/user-group/${groupId}`, data);
    },
    updateUserGroupPermission: async (groupId: string, data: Object) => {
      return await axiosInstance.patch(
        `/user-group/permission/${groupId}`,
        data
      );
    },

    createdUserGroupMapPermission: async (data: Object) => {
      return await axiosInstance.post(`/user-group-map-permission/`, data);
    },

    updateUserGroupMapPermission: async (
      groupId: string,
      data: Object,
      type: string
    ) => {
      return await axiosInstance.patch(
        `/user-group-map-permission/permission/${groupId}`,
        { ...data, type: type }
      );
    },

    deleteUserGroup: async (groupId: string) => {
      return await axiosInstance.delete(`/user-group/${groupId}`);
    },
    findAllOrganize: async () => {
      return await axiosInstance
        .get(`/organized`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getUserGroupFormOrganizedByUserId: async (userId: string) => {
      return await axiosInstance
        .get(`user-group/find-group-by-user/${userId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findUsersLowerByOwnerGroup: async (ownerGroup: string[]) => {
      return await axiosInstance
        .get(`user/find-same-and-lower-users-by-ownergroup/`, {
          params: ownerGroup,
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    setUserPermissionGroup: async (value: any) => {
      return await axiosInstance
        .post(`/user-permission-group/set`, {
          data: value,
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
export default UserGroupServices;
