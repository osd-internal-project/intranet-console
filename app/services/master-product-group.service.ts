import { AxiosInstance } from "axios";
import {
  ITMasterProductGroup,
  ITMasterProductGroupForm,
} from "../common/master-product-group";
interface TServices {
  findMany: (search: any) => Promise<ITMasterProductGroup[]>;
  findFirst: (id: number) => Promise<ITMasterProductGroup>;
  create: (data: ITMasterProductGroupForm) => Promise<ITMasterProductGroup>;
  update: (
    id: number,
    data: ITMasterProductGroupForm
  ) => Promise<ITMasterProductGroup>;
  delete: (id: number) => any;
}

const MasterProductGroupServices = (
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
    create: async (data: ITMasterProductGroupForm) => {
      const req = {
        data: data,
      };
      return await axiosInstance
        .post(`${masterProductCategoriesUrl}/`, req)
        .then((res) => {
          return res.data;
        });
    },
    update: async (id: number, data: ITMasterProductGroupForm) => {
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
export default MasterProductGroupServices;
