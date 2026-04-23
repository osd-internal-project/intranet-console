import { AxiosInstance } from "axios";
import { ITMaTaskFiles } from "@/app/page/maintenance-management/common";
import { organizeManagementCreateInput, organizeManagementConditons } from "../common/organize-management";
export interface TMaServices {
  dataTable: (conditions: organizeManagementConditons) => Promise<{ data: organizeManagementCreateInput[]; count: number }>;
  create: (form: organizeManagementCreateInput) => Promise<organizeManagementCreateInput>;
  update: (id: number, form: any) => Promise<organizeManagementCreateInput>;
  delete: (id: number) => Promise<organizeManagementCreateInput>;
}
const OrganizeManagementServices = (axiosInstance: AxiosInstance): TMaServices => {
  const baseUrl = "/organize-management";
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
  };
};

export default OrganizeManagementServices;
