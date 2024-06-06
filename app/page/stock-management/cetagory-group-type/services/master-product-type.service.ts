import { AxiosInstance } from "axios";
type CreateType = {
  typeName: string;
  activeStatus: boolean;
};

type UpdateType = {
  typeName: string;
  activeStatus: boolean;
};
const MasterProductTypeServices = (axiosInstance: AxiosInstance) => {
  const masterProductTypeUrl = "/master-product-type";
  return {
    getMasterProductTypeAll: async () => {
      const condition = {
        condition: {
          // where: {
          //   activeStatus: true,
          // },
          orderBy: { id: "asc" },
        },
      };
      return await axiosInstance
        .post(`${masterProductTypeUrl}/condition`, condition)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },
    getMasterProductTypeAllConditinons: async () => {
      const condition = {
        condition: {
          where: {
            activeStatus: true,
          },
          orderBy: { id: "asc" },
        },
      };
      return await axiosInstance
        .post(`${masterProductTypeUrl}/condition`, condition)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },
    getMasterProductTypeActive: async () => {
      return await axiosInstance
        .post(`${masterProductTypeUrl}/condition`, { where: { activeStatus: true } })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },
    create: async (data: CreateType) => {
      const req = {
        data: data,
      };
      return await axiosInstance
        .post(`${masterProductTypeUrl}/`, req)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },
    update: async (id: number, data: UpdateType) => {
      const req = {
        id: id,
        data: data,
      };
      return await axiosInstance
        .patch(`${masterProductTypeUrl}/`, req)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return err;
        });
    },
    delete: async (id: number) => {
      return await axiosInstance.delete(`${masterProductTypeUrl}/${id}`);
    },
  };
};
export default MasterProductTypeServices;
