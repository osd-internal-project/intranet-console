import { AxiosInstance } from "axios";

const OrganizeServices = (axiosInstance: AxiosInstance) => {
  const organizeUrl = `organize-chart`;
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
  };
};
export default OrganizeServices;
