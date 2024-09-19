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
  ITCustomerSub,
  ITCustomerSubDetail,
  ITCustomerSubForm,
} from "../common";
import { ITProject } from "../../project/common";
export interface TCrmServices {
  findCustomerDataTable: (
    search: object,
    take: number,
    skip: number,
    userId: string
  ) => Promise<{ data: ITCustomer[]; count: number }>;
  findProjectDataTableByCustomerId: (
    customerId: number
  ) => Promise<ITProject[]>;
  findCustomerByCustomerId: (id: number) => Promise<ITCustomer>;
  create: (form: ITCustomerForm) => Promise<ITCustomer>;
  update: (id: number, form: ITCustomerForm) => Promise<ITCustomer>;
  delete: (id: number) => Promise<ITCustomerForm>;
  findCustomerSubByCustomerId: (
    customerId: number,
    condition: object
  ) => Promise<ITCustomerSubDetail[]>;
  createCustomerSub: (
    customerId: number,
    customerSubForm: ITCustomerSubForm
  ) => Promise<ITBranch>;
  editCustomerSub: (
    id: number,
    customerSubForm: ITCustomerSubForm
  ) => Promise<ITBranch>;
  deleteCustomerSub: (id: number) => Promise<ITCustomerSubForm>;
  findBranchByCustomerId: (
    customerId: number,
    condition: object
  ) => Promise<ITBranch[]>;
  findBranchByCustomerSubId: (
    customerId: number,
    condition: object
  ) => Promise<ITBranch[]>;
  findBranchDetailByBranchId: (branchId: number) => Promise<ITBranchDetail>;
  createBranch: (
    customerId: number,
    customerSubId: number,
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
  findConfigCustomerTypeGroup: () => Promise<ITConfigData[]>;
  findConfigCustomerResponsible: () => Promise<ITConfigData[]>;
  findConfigCustomerType: () => Promise<[ITConfigData]>;
}
const CrmServices = (axiosInstance: AxiosInstance): TCrmServices => {
  const customerUrl = "/customer-detail";
  const customerSubUrl = "/customer-detail-sub";
  const customerBranchUrl = "/customer-branch";
  const customerAdrressUrl = "/customer-address";
  const customerContactUrl = "/customer-contact";
  return {
    findCustomerDataTable: async (search, take, skip, userId) => {
      return await axiosInstance
        .get(`${customerUrl}/data-table?take=${take}&skip=${skip}`, {
          params: { ...search, userid: userId },
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findProjectDataTableByCustomerId: async (custoemrId: number) => {
      return await axiosInstance
        .get(`${customerBranchUrl}/customer-project/${custoemrId}`)
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
    findCustomerSubByCustomerId: async (customerId, condition) => {
      const query = {
        ...condition,
        customerDetailId: customerId,
      };
      return await axiosInstance
        .get(`${customerSubUrl}/find-by-customer-id/${customerId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    createCustomerSub: async (customerId, form) => {
      const formData = {
        ...form,
        customerDetailId: customerId,
      };
      return await axiosInstance.post(`${customerSubUrl}/`, formData);
    },
    editCustomerSub: async (id, form) => {
      const formData = {
        ...form,
      };
      return await axiosInstance.patch(`${customerSubUrl}/${id}`, formData);
    },
    deleteCustomerSub: async (id) => {
      return await axiosInstance.delete(`${customerSubUrl}/${id}`);
    },
    findBranchByCustomerId: async (customerId, condition) => {
      const query = {
        ...condition,
      };
      return await axiosInstance
        .get(`${customerBranchUrl}/detail-list-by-customer/${customerId}`, {
          params: query,
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findBranchByCustomerSubId: async (customerSubId, condition) => {
      const query = {
        ...condition,
      };
      return await axiosInstance
        .get(
          `${customerBranchUrl}/detail-list-by-customer-sub/${customerSubId}`,
          { params: query }
        )
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
    createBranch: async (customerId, customerSubId, form) => {
      const formData = {
        ...form,
        customerId: customerId,
        customerDetailSubId: customerSubId,
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
    findConfigCustomerTypeGroup: async () => {
      return await axiosInstance
        .get(`${customerUrl}/config/customer-type-group`)
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
