import { AxiosInstance } from "axios";
import {
  ITMasterProductType,
  ITMasterProductTypeForm,
} from "../common/master-product-type";
interface TServices {
  findMany: (search: any) => Promise<ITMasterProductType[]>;
  findFirst: (id: number) => Promise<ITMasterProductType>;
  create: (data: ITMasterProductTypeForm) => Promise<ITMasterProductType>;
  update: (
    id: number,
    data: ITMasterProductTypeForm
  ) => Promise<ITMasterProductType>;
  delete: (id: number) => any;
}

const MasterProductTypeServices = (axiosInstance: AxiosInstance): TServices => {
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
    create: async (data: ITMasterProductTypeForm) => {
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
    update: async (id: number, data: ITMasterProductTypeForm) => {
      const req = {
        data: data,
      };
      return await axiosInstance
        .patch(`${masterProductCategoriesUrl}/${id}`, req)
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
export default MasterProductTypeServices;
