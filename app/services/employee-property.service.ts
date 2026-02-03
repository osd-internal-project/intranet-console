import { AxiosInstance } from "axios";
import type { ITEmployeePropertyCommon } from "../common/epmployee-property";
import type { UploadFile } from "antd";

export interface TServices {
  findAll: () => Promise<ITEmployeePropertyCommon[]>;
  findByUserId: (userId: string, values: { type: string; name: string }) => Promise<ITEmployeePropertyCommon[]>;
  findTeamsByUserId: (userId: string, values: { type: string; name: string; userId: string }) => Promise<ITEmployeePropertyCommon[]>;
  create: (form: any) => Promise<ITEmployeePropertyCommon>;
  createMistakesType: (id: number, form: any) => Promise<ITEmployeePropertyCommon>;
  update: (id: number, form: any, files?: UploadFile[]) => Promise<ITEmployeePropertyCommon>;
  delete: (id: number) => Promise<ITEmployeePropertyCommon>;
  export: (userId: string, values: { type: string; name: string }) => Promise<ArrayBuffer>;
  exportTeams: (userId: string, values: { type: string; name: string }) => Promise<ArrayBuffer>;
}

const EmployeePropertySerivce = (axiosInstance: AxiosInstance): TServices => {
  const baseUrl = "/employee-property";
  const baseUrlReport = "/report-emp-asset";
  const baseUrlMistakesType = "/mistakes-type";
  return {
    findAll: async () => {
      return await axiosInstance
        .get(`${baseUrl}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findByUserId: async (userId: string, values: { type: string; name: string }) => {
      return await axiosInstance
        .get(`${baseUrl}/find-many/${userId}`, { params: values })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findTeamsByUserId: async (userId: string, values: { type: string; name: string; userId: string }) => {
      return await axiosInstance
        .get(`${baseUrl}/find-teams/${userId}`, { params: values })
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
          return [];
        });
    },
    createMistakesType: async (id, form) => {
      const data = { ...form, employeePropertyId: id };
      return await axiosInstance
        .post(`${baseUrlMistakesType}`, data)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    update: async (id: number, form, files) => {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      const file = files?.[0];
      if (file?.originFileObj) {
        formData.append("file", file.originFileObj);
      }

      return await axiosInstance
        .patch(`${baseUrl}/${id}`, formData)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    delete: async (id: number) => {
      return await axiosInstance
        .delete(`${baseUrl}/${id}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    export: async (userId: string, values: { type: string; name: string }) => {
      return await axiosInstance
        .get(`${baseUrlReport}/export/${userId}`, { params: values, responseType: "blob" })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    exportTeams: async (userId: string, values: { type: string; name: string }) => {
      return await axiosInstance
        .get(`${baseUrlReport}/export-teams/${userId}`, { params: values, responseType: "blob" })
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
export default EmployeePropertySerivce;
