import { AxiosInstance } from "axios";
import { ITMaDetail, ITMaType } from "../common";
export interface TMaTaskServices {
  findMaTypeAll: () => Promise<ITMaDetail[]>;
  create: (form: any) => Promise<ITMaDetail>;
  update: (id: number, form: any) => Promise<ITMaDetail>;
  delete: (id: number) => Promise<ITMaDetail>;
  findActiveType: () => Promise<ITMaType[]>;
}
const UserServices = (axiosInstance: AxiosInstance): TMaTaskServices => {
  const taskUrl = "/ma-task";
  const typeUrl = "/ma-type";

  return {
    findMaTypeAll: async () => {
      return await axiosInstance
        .get(`${taskUrl}/many`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    create: async (form) => {
      return await axiosInstance
        .post(`${taskUrl}/`, form)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    update: async (id, form) => {
      return await axiosInstance
        .patch(`${taskUrl}/${id}`, form)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    delete: async (id) => {
      return await axiosInstance
        .delete(`${taskUrl}/${id}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findActiveType: async () => {
      return await axiosInstance
        .get(`${taskUrl}/many`)
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

export default UserServices;
