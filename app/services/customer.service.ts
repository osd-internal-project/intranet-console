import { AxiosInstance } from "axios";
import {
  ITCustomerGroupForm,
  ITCustomerGroup,
  ITCustomer,
  ITCustomerForm,
  ITConfigData,
} from "../common/customer";

export interface TServices {
  findCustomerListByCustomerGroup: (
    customerGropId: number,
    search: object
  ) => Promise<{ data: ITCustomer[]; count: number }>;
  findConfigCustomerTypeGroup: () => Promise<ITConfigData[]>;
  findConfigCustomerResponsible: () => Promise<ITConfigData[]>;
  findConfigCustomerType: () => Promise<[ITConfigData]>;
  create: (form: ITCustomerForm) => Promise<ITCustomer>;
  update: (id: number, form: ITCustomerForm) => Promise<ITCustomer>;
  delete: (id: number) => Promise<ITCustomerForm>;
}
const CrmServices = (axiosInstance: AxiosInstance): TServices => {
  const baseUrl = "/customer-detail";
  return {
    findCustomerListByCustomerGroup: async (customerGroupId, search) => {
      return await axiosInstance
        .get(`${baseUrl}/data-table`, {
          params: { ...search, customerGroupId: customerGroupId },
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findConfigCustomerTypeGroup: async () => {
      return await axiosInstance
        .get(`${baseUrl}/config/customer-type-group`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findConfigCustomerResponsible: async () => {
      return await axiosInstance
        .get(`${baseUrl}/config/customer-responsible`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findConfigCustomerType: async () => {
      return await axiosInstance
        .get(`${baseUrl}/config/customer-type`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    create: async (form) => {
      return await axiosInstance.post(`${baseUrl}/`, form);
    },
    update: async (id, form) => {
      return await axiosInstance
        .patch(`${baseUrl}/${id}`, { data: form })
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
        .delete(`${baseUrl}/${id}`)
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

export default CrmServices;
