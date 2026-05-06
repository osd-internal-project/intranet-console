import { AxiosInstance } from "axios";
import { ITMasterTypeEvents } from "../common/master-type-events";
export interface TMServices {
  dataTable: (conditions: ITMasterTypeEvents | {}, take: number, skip: number) => Promise<{ data: ITMasterTypeEvents[]; count: number }>;

  create: (form: any) => Promise<ITMasterTypeEvents>;
  update: (id: number, form: any) => Promise<ITMasterTypeEvents>;
  delete: (id: number) => Promise<ITMasterTypeEvents>;
  download: (fileName: string) => Promise<any>;
}
const MasterTypeEventsServices = (axiosInstance: AxiosInstance): TMServices => {
  const baseUrl = "/master-type-events";

  return {
    dataTable: async (conditions, take, skip) => {
      return await axiosInstance
        .get(`${baseUrl}?take=${take}&skip=${skip}`, { params: conditions })
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
        .post(`${baseUrl}`, form)
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

export default MasterTypeEventsServices;
