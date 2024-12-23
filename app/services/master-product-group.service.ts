import { AxiosInstance } from "axios";
type CreateType = {
  masterProductCategoriesId: number;
  groupName: string;
  status: boolean;
  masterProductGroupMapType?: {
    create?: {
      typeCode: string;
      typeName: string;
    }[];
  };
};
type UpdateType = {
  groupName: string;
  status: boolean;
  masterProductGroupMapType?: {
    deleteMany?: {};
    createMany?: { data?: { typeCode: string; typeName: string }[] };
  };
};

const masterProductGroupServices = (axiosInstance: AxiosInstance) => {
  const masterProductGroupUrl = "/master-product-group";
  return {
    getMasterProductGroupAll: async () => {
      return await axiosInstance
        .get(`${masterProductGroupUrl}/`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getMasterProductGroupByCategoryId: async (categoryId: number) => {
      const condition = {
        where: {
          masterProductCategoriesId: categoryId,
        },
        include: {
          masterProductGroupMapType: true,
        },
      };
      return await axiosInstance
        .post(`${masterProductGroupUrl}/condition`, { condition: condition })
        .then((res) => {
          console.log(res.data);
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    create: async (data: CreateType) => {
      const req = {
        data: data,
      };
      return await axiosInstance
        .post(`${masterProductGroupUrl}/`, req)
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
        .patch(`${masterProductGroupUrl}/`, req)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },
    delete: async (id: number) => {
      return await axiosInstance.delete(`${masterProductGroupUrl}/${id}`);
    },
  };
};

export default masterProductGroupServices;
