import { AxiosInstance } from "axios";

const UserRoleServices = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/user-role";
  return {
    getUserRoleAll: async () => {
      const condition = {};
      return await axiosInstance
        .post(`${baseUrl}/search`, condition)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getUserRoleByProfileId: async (profileId: string) => {
      const condition = {
        where: {
          profileId: profileId,
        },
      };
      return await axiosInstance.post(`${baseUrl}/condition`, {
        condition: condition,
      });
    },
    addUserRole: async (role: Object, profiles: string[]) => {
      const req = {
        role: role,
        profiles: profiles,
      };
      return await axiosInstance.post(`${baseUrl}/create-with-profiles`, req);
    },

    getRulesByRoleId: async (roles: string[]) => {
      const condition = {
        roleId: { in: roles },
      };
      return await axiosInstance.post(`${baseUrl}/findrule`, condition);
    },

    updateUserRole: async (roleId: string, userRole: Object, profiles: string[]) => {
      const req = {
        roleId: roleId,
        userRole: userRole,
        profiles: profiles,
      };
      return await axiosInstance.patch(`${baseUrl}/update-with-profiles`, req);
    },
    deleteUserRole: async (profileId: string) => {
      return await axiosInstance.delete(`${baseUrl}/${profileId}`);
    },
  };
};
export default UserRoleServices;
