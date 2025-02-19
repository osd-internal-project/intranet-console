import { AxiosInstance } from "axios";
import { ITCustomerProductForm, ITCustomerProduct } from "../common/product";
export interface TServices {
  findDatatable: (
    search: object,
    take: number,
    skip: number
  ) => Promise<{ data: ITCustomerProduct[]; count: number }>;
  findDetailsById: (customerGroupId: number) => Promise<ITCustomerProduct>;
  findManyByCustomerGroup: (
    customerId: number,
    search: any
  ) => Promise<ITCustomerProduct[]>;
  findManyByCustomer: (
    customerId: number,
    search: any
  ) => Promise<ITCustomerProduct[]>;
  findManyByCustomerSub: (id: number, search: any) => Promise<ITCustomerProduct[]>;
  findProductOptions: () => Promise<ITCustomerProduct[]>;
  create: (form: ITCustomerProductForm) => Promise<ITCustomerProduct>;
  update: (
    id: number,
    form: ITCustomerProductForm
  ) => Promise<ITCustomerProduct>;
  delete: (id: number) => Promise<ITCustomerProduct>;
}
const CrmServices = (axiosInstance: AxiosInstance): TServices => {
  const baseUrl = "/customer-product";
  return {
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
    findManyByCustomerGroup: async (customerGroupId, search) => {
      return await axiosInstance
        .get(`${baseUrl}/find-by-customer-group/${customerGroupId}`, {
          params: { search: search },
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findManyByCustomer: async (customerId, search) => {
      return await axiosInstance
        .get(`${baseUrl}/find-by-customer/${customerId}`, {
          params: { search: search },
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findManyByCustomerSub: async (branchId, search) => {
      return await axiosInstance
        .get(`${baseUrl}/find-by-customer-sub/${branchId}`, {
          params: { search: search },
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findProductOptions: async () => {
      return await axiosInstance
        .get(`${baseUrl}/active`)
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
