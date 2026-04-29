import { AxiosInstance } from "axios";
import type { ITypeMasterRestaurant, masterRestaurantConditons } from "../common/master-restaurant";
export interface TMaServices {
  dataTable: (conditions: masterRestaurantConditons) => Promise<{ data: ITypeMasterRestaurant[]; count: number }>;
  dataOptions: () => Promise<ITypeMasterRestaurant[]>;
  create: (form: any) => Promise<ITypeMasterRestaurant>;
  update: (id: number, form: any) => Promise<ITypeMasterRestaurant>;
  delete: (id: number) => Promise<ITypeMasterRestaurant>;
  download: (fileName: string) => Promise<any>;
}
const MasterRestaurantServices = (axiosInstance: AxiosInstance): TMaServices => {
  const baseUrl = "/master-restaurant";
  //   const customerProjectUrl = "/organize-task";

  return {
    dataTable: async (conditions) => {
      return await axiosInstance
        .post(`${baseUrl}/data-table`, conditions)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    },
    dataOptions: async () => {
      return await axiosInstance
        .get(`${baseUrl}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    },
    create: async (form) => {
      return await axiosInstance
        .post(`${baseUrl}`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    },
    update: async (id, form) => {
      return await axiosInstance
        .patch(`${baseUrl}/${id}`, form)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    },
    delete: async (id) => {
      return await axiosInstance
        .delete(`${baseUrl}/${id}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    },
    download: async (fileName: string) => {
      try {
        const res = await axiosInstance.get(`${baseUrl}/download/${fileName}`, {
          responseType: "blob",
        });
        return res.data;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  };
};

export default MasterRestaurantServices;
