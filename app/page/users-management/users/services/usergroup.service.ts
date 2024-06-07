import { AxiosInstance } from "axios";
const UserGroupServices = (axiosInstance: AxiosInstance) => {
  return {
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
    getUserGroupByGroupId: async (groupId: string) => {
      const condition = {
        where: {
          groupId: groupId,
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
    getUserGroupByOrganizedId: async (organizedGroupId: string) => {
      const condition = {
        where: {
          organizedGroupId: organizedGroupId,
        },
      };
      return await axiosInstance.post(`/user-group/condition`, {
        condition: condition,
      });
    },

    getUserGroupIdByUserIdAndOrganized: async (userId: string, organizedGroupId: string) => {
      const condition = {
        where: {
          userId: userId,
          organizedGroupId: organizedGroupId,
        },
      };
      return await axiosInstance.post(`/user-group-map/condition`, {
        condition: condition,
      });
    },
    getUserGroupIdByUserId: async (userId: string) => {
      const condition = {
        where: {
          userId: userId,
        },
      };
      return await axiosInstance.post(`/user-group-map/condition`, {
        condition: condition,
      });
    },
    addUserGroup: async (data: Object) => {
      const req = {
        data: data,
      };
      return await axiosInstance.post(`/user-group`, req);
    },

    updateUserGroup: async (groupId: string, data: Object) => {
      const req = {
        groupId: groupId,
        data: data,
      };
      return await axiosInstance.patch(`/user-group`, req);
    },
    deleteUserGroup: async (groupId: string) => {
      return await axiosInstance.delete(`/user-group/${groupId}`);
    },
  };
};
export default UserGroupServices;
