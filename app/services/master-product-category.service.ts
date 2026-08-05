import { AxiosInstance } from "axios";
import {
  ITMasterProductCategory,
  ITMasterProductCategoryForm,
} from "../common/master-product-category";
interface TServices {
  findMany: (search: any) => Promise<ITMasterProductCategory[]>;
  findFirst: (id: number) => Promise<ITMasterProductCategory>;
  create: (
    data: ITMasterProductCategoryForm
  ) => Promise<ITMasterProductCategory>;
  update: (
    id: number,
    data: ITMasterProductCategoryForm
  ) => Promise<ITMasterProductCategory>;
  delete: (id: number) => any;
}

const MasterProductCategoryServices = (
  axiosInstance: AxiosInstance
): TServices => {
  const masterProductCategoriesUrl = "/master-product-categories";
  return {
    findMany: async (search: any) => {
      return await axiosInstance
        .get(`${masterProductCategoriesUrl}/many`, {
          params: search,
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },
    findFirst: async (id: number) => {
      return await axiosInstance
        .post(`${masterProductCategoriesUrl}/${id}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },
    create: async (data: ITMasterProductCategoryForm) => {
      const req = {
        data: data,
      };
      return await axiosInstance
        .post(`${masterProductCategoriesUrl}/`, req)
        .then((res) => {
          return res.data;
        });
    },
    update: async (id: number, data: ITMasterProductCategoryForm) => {
      const req = {
        data: data,
      };
      return await axiosInstance
        .patch(`${masterProductCategoriesUrl}/${id}`, req)
        .then((res) => {
          return res.data;
        });
    },
    delete: async (id: number) => {
      return await axiosInstance.delete(`${masterProductCategoriesUrl}/${id}`);
    },
  };
};
export default MasterProductCategoryServices;
