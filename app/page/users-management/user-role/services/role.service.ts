import { AxiosInstance } from "axios";

const UserRoleServices = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/user-role";
  return {
    getUserRoleAll: async () => {
      const condition = { orderBy: { createdAt: "asc" } };
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
    getUserRoleByFilter: async (search: object) => {
      return await axiosInstance
        .post(`${baseUrl}/search`, { filter: search })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    addUserRole: async (role: Object, profiles: string[]) => {
      const req = {
        role: role,
        profiles: profiles,
      };
      return await axiosInstance.post(`${baseUrl}/create-with-profiles`, req);
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
