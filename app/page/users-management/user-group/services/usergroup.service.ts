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
          userGroupMapHeader: true,
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
    createdUserGroupHeaderPermission: async (data: Object) => {
      return await axiosInstance.post(`/user-group-map-header/`, data);
    },
    updateUserGroupHeaderPermission: async (groupId: string, data: Object) => {
      return await axiosInstance.patch(
        `/user-group-map-header/permission/${groupId}`,
        data
      );
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
    findUsersByOwnerGroup: async (ownerGroup: string[]) => {
      return await axiosInstance
        .get(`user/find-users-by-ownergroup/`, {
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
  };
};
export default UserGroupServices;
