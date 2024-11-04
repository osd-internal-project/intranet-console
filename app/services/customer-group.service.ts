import { AxiosInstance } from "axios";
import {
  ITCustomerGroupForm,
  ITCustomerGroup,
  ITCustomer,
} from "../common/customer";
// import { ITCustomer } from "../common/customer";
export interface TServices {
  findMany: () => Promise<ITCustomerGroup[]>;
  findDatatable: (
    search: object,
    take: number,
    skip: number
  ) => Promise<{ data: ITCustomerGroup[]; count: number }>;

  findDetailsById: (id: number) => Promise<ITCustomerGroup>;
  create: (form: ITCustomerGroupForm) => Promise<ITCustomerGroup>;
  update: (id: string, form: ITCustomerGroupForm) => Promise<ITCustomerGroup>;
  delete: (id: number) => Promise<ITCustomerGroup>;
}
const CrmServices = (axiosInstance: AxiosInstance): TServices => {
  const baseUrl = "/customer-group";
  const customerDetailUrl = "/customer-detail";
  return {
    findMany: async () => {
      return await axiosInstance
        .get(`${baseUrl}/`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findDatatable: async (search, take, skip) => {
      return await axiosInstance
        .get(`${baseUrl}/data-table?take=${take}&skip=${skip}`, {
          params: { search: { ...search } },
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findDetailsById: async (id) => {
      return await axiosInstance
        .get(`${baseUrl}/${id}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    create: async (form) => {
      return await axiosInstance.post(`${baseUrl}/`, form).then((res) => {
        return res.data;
      });
    },
    update: async (id, form) => {
      return await axiosInstance.patch(`${baseUrl}/${id}`, form);
    },
    delete: async (id: number) => {
      return await axiosInstance.delete(`${baseUrl}/${id}`);
    },
  };
};

export default CrmServices;
