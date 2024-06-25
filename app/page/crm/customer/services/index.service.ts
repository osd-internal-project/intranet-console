import { AxiosInstance } from "axios";
import {
  ITBranch,
  ITBranchAddress,
  ITBranchAddressForm,
  ITBranchContact,
  ITBranchContactForm,
  ITBranchDetail,
  ITBranchForm,
  ITConfigData,
  ITCustomer,
  ITCustomerForm,
} from "../common";
export interface TCrmServices {
  findCustomerDataTable: (
    search: object,
    take: number,
    skip: number
  ) => Promise<{ data: ITCustomer[]; count: number }>;
  findProjectDataTable: (branchId: number) => Promise<ITCustomer[]>;
  findCustomerByCustomerId: (id: number) => Promise<ITCustomer>;
  create: (form: ITCustomerForm) => Promise<ITCustomer>;
  update: (id: number, form: ITCustomerForm) => Promise<ITCustomer>;
  delete: (id: number) => Promise<ITCustomerForm>;
  findBranchByCustomerId: (
    customerId: number,
    condition: object
  ) => Promise<ITBranch[]>;
  findBranchDetailByBranchId: (branchId: number) => Promise<ITBranchDetail>;
  createBranch: (
    customerId: number,
    branchForm: ITBranchForm
  ) => Promise<ITBranch>;
  editBranch: (id: number, branchForm: ITBranchForm) => Promise<ITBranch>;
  deleteBranch: (id: number) => Promise<ITBranch>;
  createBranchAddress: (
    customerBranchId: number,
    address: ITBranchAddressForm
  ) => Promise<ITBranchAddress>;
  deleteBranchAddress: (addressId: number) => Promise<ITBranchAddress>;
  createBranchContact: (
    customerBranchId: number,
    contact: ITBranchContactForm
  ) => Promise<ITBranchAddress>;
  deleteBranchContact: (contactId: number) => Promise<ITBranchContact>;
  findConfigCustomerGroup: () => Promise<ITConfigData[]>;
  findConfigCustomerResponsible: () => Promise<ITConfigData[]>;
  findConfigCustomerType: () => Promise<[ITConfigData]>;
}
const CrmServices = (axiosInstance: AxiosInstance): TCrmServices => {
  const customerUrl = "/customer-detail";
  const customerBranchUrl = "/customer-branch";
  const customerAdrressUrl = "/customer-address";
  const customerContactUrl = "/customer-contact";
  return {
    findCustomerDataTable: async (search, take, skip) => {
      return await axiosInstance
        .get(`${customerUrl}/data-table?take=${take}&skip=${skip}`, {
          params: search,
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findProjectDataTable: async (branchId: number) => {
      return await axiosInstance
        .get(`${customerBranchUrl}/customer-project/${branchId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findCustomerByCustomerId: async (id) => {
      return await axiosInstance
        .get(`${customerUrl}/${id}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    create: async (form) => {
      return await axiosInstance.post(`${customerUrl}/`, form);
    },
    update: async (id, form) => {
      return await axiosInstance
        .patch(`${customerUrl}/${id}`, { data: form })
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
        .delete(`${customerUrl}/${id}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findBranchByCustomerId: async (customerId, condition) => {
      const query = {
        ...condition,
        customerDetailId: customerId,
      };
      return await axiosInstance
        .get(`${customerBranchUrl}/many`, {
          data: query,
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findBranchDetailByBranchId: async (branchId) => {
      return await axiosInstance
        .get(`${customerBranchUrl}/detail/${branchId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    createBranch: async (customerId, form) => {
      const formData = {
        ...form,
        customerDetailId: customerId,
      };
      return await axiosInstance.post(`${customerBranchUrl}/`, formData);
    },
    editBranch: async (id, form) => {
      const formData = {
        ...form,
      };
      return await axiosInstance.patch(`${customerBranchUrl}/${id}`, formData);
    },
    deleteBranch: async (id) => {
      return await axiosInstance.delete(`${customerBranchUrl}/${id}`);
    },
    createBranchAddress: async (customerBranchId, form) => {
      const formData = {
        ...form,
        customerBranchId: customerBranchId,
      };
      return await axiosInstance.post(`${customerAdrressUrl}/`, formData);
    },
    deleteBranchAddress: async (id) => {
      return await axiosInstance.delete(`${customerAdrressUrl}/${id}`);
    },
    createBranchContact: async (customerBranchId, form) => {
      const formData = {
        ...form,
        customerBranchId: customerBranchId,
      };
      return await axiosInstance.post(`${customerContactUrl}/`, formData);
    },
    deleteBranchContact: async (id) => {
      return await axiosInstance.delete(`${customerContactUrl}/${id}`);
    },
    findConfigCustomerGroup: async () => {
      return await axiosInstance
        .get(`${customerUrl}/config/customer-group`)
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
        .get(`${customerUrl}/config/customer-responsible`)
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
        .get(`${customerUrl}/config/customer-type`)
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
