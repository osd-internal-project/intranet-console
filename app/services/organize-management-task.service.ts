import { AxiosInstance } from "axios";
import { organizeManagementTaskCreateInput, organizeManagementConditons, type organizeTaskCreateInput } from "../common/organize-management-task";
export interface TMaServices {
  dataTable: (conditions: organizeManagementConditons) => Promise<{ data: organizeManagementTaskCreateInput[]; count: number }>;
  getDataById: (id: string) => Promise<organizeManagementTaskCreateInput>;
  getByOrganizeId: (id: string) => Promise<organizeTaskCreateInput[]>;
  create: (form: organizeManagementTaskCreateInput) => Promise<organizeManagementTaskCreateInput>;
  createTask: (form: any) => Promise<organizeTaskCreateInput>;
  createSubTask: (form: any) => Promise<organizeTaskCreateInput>;
  update: (id: number, form: any) => Promise<organizeManagementTaskCreateInput>;
  delete: (id: number) => Promise<organizeManagementTaskCreateInput>;
  deleteTask: (id: number) => Promise<organizeManagementTaskCreateInput>;
  deleteSubTask: (id: number) => Promise<organizeManagementTaskCreateInput>;
  download: (fileName: string) => Promise<any>;
}
const OrganizeManagementServices = (axiosInstance: AxiosInstance): TMaServices => {
  const baseUrl = "/organize-management";
  const baseUrlTask = "/organize-management-task";
  const baseUrlSubTask = "/organize-sub-task";

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
    getDataById: async (id: string) => {
      return await axiosInstance
        .get(`${baseUrl}/${id}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    },
    getByOrganizeId: async (id) => {
      return await axiosInstance
        .get(`${baseUrlTask}/${id}`)
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
    createTask: async (form) => {
      return await axiosInstance
        .post(`${baseUrlTask}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    },
    createSubTask: async (form) => {
      return await axiosInstance
        .post(`${baseUrlSubTask}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
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
        .put(`${baseUrl}/${id}`, form)
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
    deleteTask: async (id) => {
      return await axiosInstance
        .delete(`${baseUrlTask}/${id}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    },
    deleteSubTask: async (id) => {
      return await axiosInstance
        .delete(`${baseUrlSubTask}/${id}`)
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

export default OrganizeManagementServices;
