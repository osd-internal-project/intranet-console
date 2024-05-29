import { AxiosInstance } from "axios";
import { ITypeMasterProduct } from "../common";

const MasterProductServices = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/master-product";
  const imageUrl = "/master-product-image";
  const imageGhsUrl = "/master-ghs-type";
  const filesUrl = "master-product-files";
  return {
    getMasterProducts: async (condition: object) => {
      return await axiosInstance
        .post(`${baseUrl}/condition`, { condition: condition })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },
    getMasterProductByCasNo: async (casNo: string) => {
      return await axiosInstance
        .post(`${baseUrl}/find-by-casno`, { casno: casNo })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },
    getImages: async (condition: any) => {
      return await axiosInstance
        .get(`${imageUrl}/get_image?image=${condition}`, { responseType: "blob" })
        .then((result) => result.data)
        .catch((err) => console.log(err));
    },
    dataImagesGhs: async (condition: any) => {
      return await axiosInstance
        .get(`${imageGhsUrl}/get_image/ghs?image=${condition}`, { responseType: "blob" })
        .then((result) => result.data)
        .catch((err) => console.log(err));
    },
    remove: async (id: number) => {
      return await axiosInstance
        .delete(`${baseUrl}/${id}`)
        .then((result) => result.data)
        .catch((err) => console.log(err));
    },
    downloadfile: async (id: number) => {
      return await axiosInstance
        .get(`${filesUrl}/download/${id}`, { responseType: "blob" })
        .then((result) => result.data)
        .catch((err) => console.log(err));
    },
  };
};

export default MasterProductServices;
