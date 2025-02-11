import { AxiosInstance } from "axios";
import {
  ITCustomerDetailSub,
  ITCustomerDetailSubAddress,
  ITCustomerDetailSubAddressForm,
  ITCustomerDetailSubContact,
  ITCustomerDetailSubContactForm,
  ITCustomerDetailSubDetail,
  ITCustomerDetailSubForm,
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
  ) => Promise<ITCustomerDetailSub>;
  editCustomerSub: (
    id: number,
    customerSubForm: ITCustomerSubForm
  ) => Promise<ITCustomerDetailSub>;
  deleteCustomerSub: (id: number) => Promise<ITCustomerSubForm>;
  findBranchByCustomerId: (
    customerId: number,
    condition: object
  ) => Promise<ITCustomerDetailSub[]>;
  findBranchByCustomerSubId: (
    customerId: number,
    condition: object
  ) => Promise<ITCustomerDetailSub[]>;
  findBranchDetailByBranchId: (branchId: number) => Promise<ITCustomerDetailSubDetail>;
  createBranch: (
    customerId: number,
    customerSubId: number,
    branchForm: ITCustomerDetailSubForm
  ) => Promise<ITCustomerDetailSub>;
  editBranch: (id: number, branchForm: ITCustomerDetailSubForm) => Promise<ITCustomerDetailSub>;
  deleteBranch: (id: number) => Promise<ITCustomerDetailSub>;
  createBranchAddress: (
    customerBranchId: number,
    address: ITCustomerDetailSubAddressForm
  ) => Promise<ITCustomerDetailSubAddress>;
  deleteBranchAddress: (addressId: number) => Promise<ITCustomerDetailSubAddress>;
  createBranchContact: (
    customerBranchId: number,
    contact: ITCustomerDetailSubContactForm
  ) => Promise<ITCustomerDetailSubAddress>;
  deleteBranchContact: (contactId: number) => Promise<ITCustomerDetailSubContact>;
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
        customerDetailId: customerId,
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
