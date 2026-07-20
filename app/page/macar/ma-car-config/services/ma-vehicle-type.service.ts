import { AxiosInstance } from "axios";

/** CRUD master "ประเภทรถ" (maVehicleType) — ตามแบบ manage-car.service.ts */
export const MaVehicleTypeServices = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/ma-vehicle-type";

  return {
    getMaVehicleTypeQuery: async () => {
      return await axiosInstance
        .get(`${baseUrl}`)
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    createMaVehicleType: async (body: any) => {
      return await axiosInstance
        .post(`${baseUrl}`, body)
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return null;
        });
    },

    updateMaVehicleType: async (id: number, body: any) => {
      return await axiosInstance
        .patch(`${baseUrl}/${id}`, body)
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return null;
        });
    },

    deleteMaVehicleType: async (id: number) => {
      return await axiosInstance
        .delete(`${baseUrl}/${id}`)
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return null;
        });
    },
  };
};
