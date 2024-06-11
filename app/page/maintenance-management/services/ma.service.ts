import { AxiosInstance } from "axios";
import { ITMaDetail, ITMaTask, ITMaType } from "../common";
export interface TMaTaskServices {
  // findMaTaskAll: () => Promise<ITMaTask[]>;
  findMaTaskByRange: (start: Date, end: Date) => Promise<ITMaTask[]>;
  findMaTaskById: (id: number) => Promise<ITMaTask>;
  findMaDataTable: (page: { take: number; skip: number; search: object }) => Promise<{ data: ITMaTask[]; count: number }>;
  create: (form: any) => Promise<ITMaTask>;
  update: (id: number, form: any) => Promise<ITMaTask>;
  delete: (id: number) => Promise<ITMaTask>;
  uploadFiles: (id: number, form: any) => Promise<any>;
  downloadFile: (id: number) => Promise<Blob>;
  findActiveType: () => Promise<ITMaType[]>;
  exportMaReport: (page: { search: object }) => Promise<ArrayBuffer>;
}
const MaServices = (axiosInstance: AxiosInstance): TMaTaskServices => {
  const taskUrl = "/ma-task";
  const filesUrl = "/ma-task-files";
  const typeUrl = "/ma-type";
  const reportUrl = "/report-ma-task";

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
    findMaDataTable: async (req: { take: number; skip: number; search: object }) => {
      return await axiosInstance
        .get(`${taskUrl}/data-table?take=${req.take}&skip=${req.skip}`, { params: req.search })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findMaTaskByRange: async (start, end) => {
      return await axiosInstance
        .get(`${taskUrl}/range-event`, { params: { start: start, end: end } })
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
    uploadFiles: async (id: number, form: any) => {
      return await axiosInstance
        .post(`${filesUrl}/${id}`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((result) => result.data)
        .catch((err) => err);
    },
    downloadFile: async (id: number) => {
      return await axiosInstance
        .get(`${filesUrl}/get-file/${id}`, { responseType: "blob" })
        .then((result) => {
          return result.data;
        })
        .catch((err) => console.log(err));
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
    exportMaReport: async (req: { search: object }) => {
      return await axiosInstance
        .post(`${reportUrl}/export`, { body: req.search }, { responseType: "arraybuffer" })
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

export default MaServices;
