import { AxiosInstance } from "axios";
import { Dayjs } from "dayjs";
import { ITMasterProduct, ITMasterProductCreateInput, MasterProductImage } from "../common/master-product";
interface TServices {
  findMany: (
    search: { unitName?: string; createdAt?: Dayjs | string | null },
    skip: number,
    take: number,
  ) => Promise<{ data: ITMasterProduct[]; count: number }>;
  findOne: (prdId: string) => Promise<ITMasterProduct>;
  create: (data: ITMasterProductCreateInput) => Promise<ITMasterProduct>;
  update: (id: number, data: ITMasterProductCreateInput) => Promise<ITMasterProduct>;
  delete: (id: number) => Promise<number>;
  uploadImage: (prdId: string, body: any) => Promise<MasterProductImage>;
}

const MasterProductServices = (axiosInstance: AxiosInstance): TServices => {
  const masterproductUrl = "/master-product";
  const masterproductimagesUrl = "/master-product-image";

  return {
    findMany: async (search, skip, take) => {
      return await axiosInstance
        .get(`${masterproductUrl}?take=${take}&skip=${skip}`, {
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
    findOne: async (prdId) => {
      return await axiosInstance
        .get(`${masterproductUrl}/${prdId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },

    create: async (data: ITMasterProductCreateInput) => {
      const req = {
        ...data,
      };
      return await axiosInstance
        .post(`${masterproductUrl}`, req)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },
    update: async (id: number, data: ITMasterProductCreateInput) => {
      const req = {
        ...data,
      };
      return await axiosInstance
        .patch(`${masterproductUrl}/${id}`, req)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return err;
        });
    },
    delete: async (id: number) => {
      return await axiosInstance.delete(`${masterproductUrl}/${id}`);
    },
    uploadImage: async (prdId: string, body: any) => {
      return await axiosInstance
        .post(`${masterproductimagesUrl}/upload-images/${prdId}`, body, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
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
export default MasterProductServices;
