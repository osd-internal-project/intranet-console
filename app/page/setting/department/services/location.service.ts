import { AxiosInstance } from "axios";
// import { ITypeCreateBodyBrands } from "../common";

export const LocationServices = (axiosInstance: AxiosInstance) => {
  const apiListMasterLocation = "/location";
  const apiListMasterInventory = "/inventory";
  const apiListorganized = "/organized";
  return {
    findAll: async () => {
      return await axiosInstance
        .get(`${apiListMasterLocation}`)
        .then((result) => result.data)
        .catch((err) => err);
    },
    findByCondition: async (filters: any) => {
      const condition = {
        where: filters,
        orderBy: { createdAt: "asc" },
      };
      return await axiosInstance
        .post(`${apiListMasterLocation}/condition`, {
          condition: condition,
        })
        .then((result) => result.data)
        .catch((err) => err);
    },
    findInventoryAll: async () => {
      return await axiosInstance
        .get(`${apiListMasterInventory}`)
        .then((result) => result.data)
        .catch((err) => err);
    },
    findinventoryNoOwner: async (locationId: number) => {
      return await axiosInstance
        .get(`${apiListMasterInventory}/not-owner?location=${locationId}`)
        .then((result) => result.data)
        .catch((err) => err);
    },

    findinventorybyID: async (location_id: string) => {
      const condition = {
        condition: {
          where: {
            locationId: location_id,
          },
        },
      };
      return await axiosInstance
        .post(`${apiListMasterInventory}/condition`, condition)
        .then((result) => result.data)
        .catch((err) => err);
    },
    countInventorybyID: async (locationId: number) => {
      const condition = {
        condition: {
          where: {
            locationId: locationId,
          },
        },
      };
      return await axiosInstance
        .post(`${apiListMasterInventory}/count`, condition)
        .then((result) => result.data)
        .catch((err) => err);
    },

    getImages: async (condition: any) => {
      return await axiosInstance
        .get(`${apiListMasterLocation}/get_image/company?image=${condition}`, { responseType: "blob" })
        .then((result) => result.data)
        .catch((err) => console.log(err));
    },
    create: async (condition: any) => {
      return await axiosInstance
        .post(`${apiListMasterLocation}`, condition)
        .then((result) => result.data)
        .catch((err) => err);
    },
    createInventory: async (condition: any) => {
      return await axiosInstance
        .post(`${apiListMasterInventory}`, condition)
        .then((result) => result.data)
        .catch((err) => err);
    },
    uploadNewImages: async (id: number, dataUpload: any) => {
      return await axiosInstance
        .post(`${apiListMasterLocation}/images/${id}`, dataUpload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((result) => result.data)
        .catch((err) => err);
    },
    update: async (condition: any) => {
      return await axiosInstance
        .patch(`${apiListMasterLocation}`, condition)
        .then((result) => result.data)
        .catch((err) => err);
    },
    updateInventory: async (condition: any) => {
      return await axiosInstance
        .patch(`${apiListMasterInventory}`, condition)
        .then((result) => result.data)
        .catch((err) => err);
    },

    remove: async (locationId: number, res: number) => {
      const dataResult = {
        id: res,
        locationId: String(locationId),
      };
      return await axiosInstance
        .delete(`${apiListMasterLocation}`, { data: dataResult })
        .then((result) => result.data)
        .catch((err) => err);
    },

    deleteImage: async (res: number) => {
      const dataResult = {
        images_location: String(res),
      };
      return await axiosInstance
        .delete(`${apiListMasterLocation}/delete-image`, { data: dataResult })
        .then((result) => result.data)
        .catch((err) => err);
    },

    removeInventory: async (res: number) => {
      const dataResult = {
        id: res,
      };
      return await axiosInstance
        .delete(`${apiListMasterInventory}`, { data: dataResult })
        .then((result) => result.data)
        .catch((err) => err);
    },
    findOragniationAll: async () => {
      return await axiosInstance
        .get(`${apiListorganized}`)
        .then((result) => result.data)
        .catch((err) => err);
    },
  };
};
