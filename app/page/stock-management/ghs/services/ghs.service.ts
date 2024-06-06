import { AxiosInstance } from "axios";
const GhsServices = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/master-ghs-type";
  return {
    getImages: async (condition: any) => {
      return await axiosInstance
        .get(`${baseUrl}/get_image/ghs?image=${condition}`, { responseType: "blob" })
        .then((result) => result.data)
        .catch((err) => console.log(err));
    },
    getMasterGhsAll: async (search: any) => {
      const condition = {
        where: search,
        orderBy: { id: "asc" },
      };
      return await axiosInstance
        .post(`${baseUrl}/condition`, {
          condition: condition,
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getMasterGhsByGhsId: async (ghsCode: string) => {
      const condition = {
        where: {
          ghsCode: ghsCode,
        },
      };
      return await axiosInstance.post(`${baseUrl}/condition`, {
        condition: condition,
      });
    },

    uploadNewImages: async (id: string, dataUpload: any) => {
      return await axiosInstance
        .post(`${baseUrl}/images/${id}`, dataUpload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((result) => result.data)
        .catch((err) => err);
    },
    addMasterGhs: async (data: Object) => {
      const req = {
        data: data,
      };
      return await axiosInstance
        .post(`${baseUrl}`, req)
        .then((result) => result.data)
        .catch((err) => err);
    },

    updateMasterGhs: async (data: any) => {
      return await axiosInstance.patch(`${baseUrl}`, data);
    },
    deleteMasterGhs: async (ghsCode: string) => {
      return await axiosInstance.delete(`${baseUrl}/${ghsCode}`);
    },
    remove: async (res: number, ghsId: string) => {
      const dataResult = {
        id: res,
        ghsId: ghsId,
      };
      return await axiosInstance
        .delete(`${baseUrl}`, { data: dataResult })
        .then((result) => result.data)
        .catch((err) => err);
    },

    deleteImageGhs: async (res: string) => {
      const dataResult = {
        imageGhs: res,
      };
      return await axiosInstance
        .delete(`${baseUrl}/delete-image-ghs`, { data: dataResult })
        .then((result) => result.data)
        .catch((err) => err);
    },
  };
};
export default GhsServices;
