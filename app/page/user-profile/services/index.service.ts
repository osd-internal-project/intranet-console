import { AxiosInstance } from "axios";
type createdType = {
  username: string;
  email: string;
  activeStatus: boolean;
  password: string;
  firstNameTh: string;
  lastNameTh: string;
  phoneNumber: string;
  masterPositionId: number;
};
type detailType = {
  userId: string;
  username: string;
  firstNameTh?: string;
  lastNameTh?: string;
  firstNameEn?: string;
  lastNameEn?: string;
  email?: string;
  phoneNumber: string;
  activeStatus: boolean;
  createdAt: Date;
  updatedAt: Date;
  password: string;
  masterPositionId?: number;
  masterPosition?: { nameTh?: string; nameEn?: string };
};

export interface IUserServices {
  getUsersAll: () => Promise<any>;
  getUsersByUserId: (data: any) => Promise<any>;
  getUsersByCondition: (data: any) => Promise<any>;
  create: (data: any) => Promise<any>;
}

const ProfileServices = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/user";
  const positionUrl = "master-position";
  return {
    getUsersAll: async (where: object) => {
      const condition = {
        where: where,
        select: {
          userId: true,
          username: true,
          firstNameTh: true,
          lastNameTh: true,
          firstNameEn: true,
          lastNameEn: true,
          email: true,
          phoneNumber: true,
          activeStatus: true,
          clientId: true,
          createdAt: true,
          updatedAt: true,
          masterPosition: {
            select: {
              nameTh: true,
              nameEn: true,
            },
          },
        },
      };
      return await axiosInstance
        .post(`${baseUrl}/condition`, { condition: condition })
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
          activeStatus: true,
          clientId: true,
          createdAt: true,
          updatedAt: true,
          startWork: true,
          empId: true,
          masterPosition: true,
        },
      };
      return await axiosInstance
        .post(`${baseUrl}/condition-first`, { condition: condition })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getUsersByCondition: async (condition: object) => {
      return await axiosInstance
        .post(`${baseUrl}/condition-first`, { condition: condition })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getRoleIdmapByUserId: async (userId: string) => {
      const condition = {
        where: { userId: userId },
        select: { userRoleMap: { select: { userRoleId: true } } },
      };
      return await axiosInstance
        .post(`${baseUrl}/condition-first`, { condition: condition })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    getDuplicateUsername: async (userId: string, username: string) => {
      return await axiosInstance
        .post(`${baseUrl}/find-duplicate-username`, { userId: userId, username: username })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    addUser: async (value: createdType) => {
      return await axiosInstance
        .post(`${baseUrl}`, { data: value })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    updateUser: async (userId: string, data: Object) => {
      const req = {
        userId: userId,
        data: data,
      };
      return await axiosInstance.patch(`${baseUrl}`, req);
    },
    setUserRolesMap: async (userId: string, roles: any[]) => {
      const req = {
        userId: userId,
        roles: roles,
      };
      return await axiosInstance.post(`${baseUrl}/set-user-roles-map`, req);
    },
    setUserGroupMap: async (userId: string, organizedGroupId: string, ownerGroup: string, group: string[]) => {
      const req = {
        ownerGroupId: ownerGroup,
        userId: userId,
        group: group,
        organizedGroupId: organizedGroupId,
      };
      return await axiosInstance.post(`${baseUrl}/set-user-group-map`, req);
    },
    changeUserPassword: async (userId: string, newPassword: string) => {
      return await axiosInstance.patch(`/auth/reset-password`, { userId: userId, newPassword: newPassword });
    },
    remove: async (id: string) => {
      return await axiosInstance.delete(`${baseUrl}/${id}`);
    },
    getMasterPositionAll: async () => {
      return await axiosInstance
        .get(`${positionUrl}/`)
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
export default ProfileServices;
