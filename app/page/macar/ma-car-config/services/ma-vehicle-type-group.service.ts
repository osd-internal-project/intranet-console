import { AxiosInstance } from "axios";

/** CRUD "กลุ่มประเภทรถ" (maVehicleTypeGroup) */
export const MaVehicleTypeGroupServices = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/ma-vehicle-type-group";

  return {
    getMaVehicleTypeGroupQuery: async () => {
      return await axiosInstance
        .get(`${baseUrl}`)
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    createMaVehicleTypeGroup: async (body: any) => {
      return await axiosInstance
        .post(`${baseUrl}`, body)
        .then((res) => res.data);
    },

    updateMaVehicleTypeGroup: async (id: number, body: any) => {
      return await axiosInstance
        .patch(`${baseUrl}/${id}`, body)
        .then((res) => res.data);
    },

    deleteMaVehicleTypeGroup: async (id: number) => {
      return await axiosInstance
        .delete(`${baseUrl}/${id}`)
        .then((res) => res.data);
    },
  };
};
