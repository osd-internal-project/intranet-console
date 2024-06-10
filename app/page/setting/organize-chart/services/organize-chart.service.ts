import { AxiosInstance } from "axios";

const OrganizeServices = (axiosInstance: AxiosInstance) => {
  const organizeUrl = `organize-chart`;
  const userMapOrganizeUrl = `user-map-organize`;
  return {
    getOrganizeAll: async () => {
      return await axiosInstance
        .get(`${organizeUrl}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getOrganizeByType: async (type: string) => {
      return await axiosInstance
        .get(`${organizeUrl}/type/${type}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getOrganizeByQuery: async (params: any) => {
      return await axiosInstance
        .get(`${organizeUrl}/query`, { params })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getChildrenOrganizeById: async (rootId: any) => {
      return await axiosInstance
        .get(`${organizeUrl}/findChildrenById/${rootId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findChildrenUserById: async (positionId: any) => {
      return await axiosInstance
        .get(`${organizeUrl}/findChildrenUserById/${positionId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return 500;
        });
    },
    getOneOrganizeById: async (id: any) => {
      return await axiosInstance
        .get(`${organizeUrl}/${id}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    createOrganize: async (data: any) => {
      return await axiosInstance
        .post(`${organizeUrl}`, data)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    updateOrganize: async (organizeId: string, data: any) => {
      return await axiosInstance
        .patch(`${organizeUrl}/${organizeId}`, data)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    deleteOrganize: async (organizeId: string) => {
      return await axiosInstance
        .delete(`${organizeUrl}/${organizeId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return 500;
        });
    },
    createUserMapOrganizeUrl: async (data: any) => {
      return await axiosInstance
        .post(`${userMapOrganizeUrl}`, data)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return 500;
        });
    },
    findUserMapOrganizeUrl: async (positionId: any) => {
      return await axiosInstance
        .get(`${userMapOrganizeUrl}/byposition/${positionId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return 500;
        });
    },
    deleteUserMapOrganizeByUserId: async (userId: any) => {
      return await axiosInstance
        .delete(`${userMapOrganizeUrl}/${userId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return 500;
        });
    },
  };
};
export default OrganizeServices;
