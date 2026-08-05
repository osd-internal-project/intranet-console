import { AxiosInstance } from "axios";
import { TdepartmentCreateDto, TdepartmentFindMany } from "../common";
export interface TMaServices {
  findMany: () => Promise<TdepartmentFindMany[]>;
  create: (form: TdepartmentCreateDto) => Promise<any>;
  update: (id: number, form: TdepartmentCreateDto) => Promise<any>;
  delete: (id: number) => Promise<any>;
}
const DepartmentServices = (axiosInstance: AxiosInstance): TMaServices => {
  const departmentUrl = "/department";
  return {
    findMany: async () => {
      return await axiosInstance
        .get(`${departmentUrl}`)
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
        .post(`${departmentUrl}/`, form)
        .then((res) => {
          return res.data;
        });
    },
    update: async (id, form) => {
      return await axiosInstance
        .patch(`${departmentUrl}/${id}`, form)
        .then((res) => {
          return res.data;
        });
    },
    delete: async (id) => {
      return await axiosInstance
        .delete(`${departmentUrl}/${id}`)
        .then((res) => {
          return res.data;
        });
    },
  };
};

export default DepartmentServices;
