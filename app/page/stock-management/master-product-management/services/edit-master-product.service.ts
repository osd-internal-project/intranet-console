import { AxiosInstance } from "axios";
import { ITypeMasterProductForm, ITypeMasterProductFormEdit } from "../common";

const AddMasterProductServices = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/master-product";
  const imageUrl = "/master-product-image";
  const filesUrl = "/master-product-files";
  const brandUrl = "/brand";
  const locationUrl = "/location";
  const masterGhsTypeUrl = "/master-ghs-type";
  const masterProductCategoriesUrl = "/master-product-categories";
  const masterProductGroupUrl = "/master-product-group";
  const venderUrl = "/vender";
  const unitUrl = "/unit";
  return {
    getImages: async (condition: any) => {
      return await axiosInstance
        .get(`${imageUrl}/get_image?image=${condition}`, {
          responseType: "blob",
        })
        .then((result) => result.data)
        .catch((err) => console.log(err));
    },
    getMasterGhs: async () => {
      return await axiosInstance
        .post(`${masterGhsTypeUrl}/condition`, {
          condition: { where: { status: true } },
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },
    getBrand: async () => {
      return await axiosInstance
        .post(`${brandUrl}/condition`, {
          condition: { where: { status: true } },
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },
    getLocation: async () => {
      return await axiosInstance
        .post(`${locationUrl}/condition`, {
          condition: { where: { status: true } },
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },
    getMasterProductCategoryAll: async () => {
      return await axiosInstance
        .post(`${masterProductCategoriesUrl}/condition`, {})
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },
    getActiveMasterProductGroupByCategoryId: async (categoryId: number) => {
      const condition = {
        where: {
          masterProductCategoriesId: categoryId,
          status: true,
        },
        include: {
          masterProductGroupMapType: true,
        },
      };
      return await axiosInstance
        .post(`${masterProductGroupUrl}/condition`, { condition: condition })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getVender: async () => {
      const condition = {
        where: {
          status: true,
        },
      };
      return await axiosInstance
        .post(`${venderUrl}/condition`, { condition: condition })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getUnit: async () => {
      const condition = {
        where: {
          status: true,
        },
      };
      return await axiosInstance
        .post(`${unitUrl}/condition`, { condition: condition })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },
    update: async (pid: string, form: ITypeMasterProductFormEdit) => {
      return await axiosInstance
        .patch(`${baseUrl}/${pid}`, { data: form })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },
    uploadNewImages: (id: string, dataUpload: any) => {
      return axiosInstance
        .post(`${imageUrl}/images/${id}`, dataUpload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((result) => result.data)
        .catch((err) => err);
    },
    deleteImage: async (res: string) => {
      const dataResult = {
        imageMasterProduct: res,
      };
      return await axiosInstance
        .delete(`${imageUrl}/delete-image-masterproduct`, { data: dataResult })
        .then((result) => result.data)
        .catch((err) => err);
    },
    uploadNewFiles: (id: string, dataUpload: any) => {
      return axiosInstance
        .post(`${filesUrl}/files/${id}`, dataUpload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((result) => result.data)
        .catch((err) => err);
    },
  };
};
export default AddMasterProductServices;
