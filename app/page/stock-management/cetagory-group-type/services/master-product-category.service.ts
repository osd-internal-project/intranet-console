import { AxiosInstance } from "axios";
type CreateType = {
  categoryName: string;
};

type UpdateType = {
  categoryName: string;
};
const masterProductCategoryServices = (axiosInstance: AxiosInstance) => {
  const masterProductCategoriesUrl = "/master-product-categories";
  return {
    getMasterProductCategoryAll: async () => {
      return await axiosInstance
        .post(`${masterProductCategoriesUrl}/condition`, { orderBy: { id: "asc" } })
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
        .post(`${masterProductCategoriesUrl}/`, req)
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
        .patch(`${masterProductCategoriesUrl}/`, req)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return err;
        });
    },
    delete: async (id: number) => {
      return await axiosInstance.delete(`${masterProductCategoriesUrl}/${id}`);
    },
  };
};
export default masterProductCategoryServices;
