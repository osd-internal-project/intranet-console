import { AxiosInstance } from "axios";
import { ITMaType, ITMaTypeForm } from "../common";
export interface TMaServices {
  findMaTypeAll: () => Promise<ITMaType[]>;
  create: (form: ITMaTypeForm) => Promise<ITMaType>;
  update: (id: number, form: ITMaTypeForm) => Promise<ITMaType>;
  delete: (id: number) => Promise<ITMaType>;
}
const UserServices = (axiosInstance: AxiosInstance): TMaServices => {
  const userUrl = "/ma-type";
  return {
    findMaTypeAll: async () => {
      return await axiosInstance
        .get(`${userUrl}/many`)
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
        .post(`${userUrl}/`, form)
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
        .patch(`${userUrl}/${id}`, form)
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
        .delete(`${userUrl}/${id}`)
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
