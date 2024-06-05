import { AxiosInstance } from "axios";
import { ITMaDetail, ITMaTask, ITMaType } from "../common";
export interface TMaTaskServices {
  // findMaTaskAll: () => Promise<ITMaTask[]>;
  findMaTaskById: (id: number) => Promise<ITMaTask>;
  findMaDataTable: (page: { take: number; skip: number }) => Promise<{ data: ITMaTask[]; count: number }>;
  create: (form: any) => Promise<ITMaTask>;
  update: (id: number, form: any) => Promise<ITMaTask>;
  delete: (id: number) => Promise<ITMaTask>;
  findActiveType: () => Promise<ITMaType[]>;
}
const UserServices = (axiosInstance: AxiosInstance): TMaTaskServices => {
  const taskUrl = "/ma-task";
  const typeUrl = "/ma-type";

  return {
    //   findMaTaskAll: async () => {
    //     return await axiosInstance
    //       .get(`${taskUrl}/`)
    //       .then((res) => {
    //         return res.data;
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //         return [];
    //       });
    //   },
    findMaTaskById: async (id: number) => {
      return await axiosInstance
        .get(`${taskUrl}/${id}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findMaDataTable: async (page: { take: number; skip: number }) => {
      return await axiosInstance
        .get(`${taskUrl}/data-table?take=${page.take}&skip=${page.skip}`)
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
        .patch(`${taskUrl}/${id}`, { data: form })
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
        .get(`${typeUrl}/active`)
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
