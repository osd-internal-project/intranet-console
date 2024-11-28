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
} from "../common/customer";
import { ITProject } from "../common/project";
export interface TCrmServices {
  findManyByCustomerId: (
    customerId: number,
    search: object
  ) => Promise<ITBranchDetail[]>;
  findManyByCustomerSubId: (
    customerSubId: number,
    condition: object
  ) => Promise<ITBranch[]>;
  findDetailByBranchId: (branchId: number) => Promise<ITBranchDetail>;
  create: (
    customerId: number,
    customerSubId: number,
    branchForm: ITBranchForm
  ) => Promise<ITBranch>;
  update: (id: number, branchForm: ITBranchForm) => Promise<ITBranch>;
  delete: (id: number) => Promise<ITBranch>;
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
}
const CrmServices = (axiosInstance: AxiosInstance): TCrmServices => {
  const customerBranchUrl = "/customer-branch";
  const customerAddressUrl = "/customer-address";
  const customerContactUrl = "/customer-contact";
  return {
    findManyByCustomerId: async (customerId, search) => {
      return await axiosInstance
        .get(`${customerBranchUrl}/detail-list-by-customer/${customerId}`, {
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
    findManyByCustomerSubId: async (customerSubId, condition) => {
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
    findDetailByBranchId: async (branchId) => {
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
    create: async (customerId, customerSubId, form) => {
      const formData = {
        ...form,
        customerDetailId: customerId,
        customerDetailSubId: customerSubId,
      };
      return await axiosInstance.post(`${customerBranchUrl}/`, formData);
    },
    update: async (id, form) => {
      const formData = {
        ...form,
      };
      return await axiosInstance.patch(`${customerBranchUrl}/${id}`, formData);
    },
    delete: async (id) => {
      return await axiosInstance.delete(`${customerBranchUrl}/${id}`);
    },
    createBranchAddress: async (customerBranchId, form) => {
      const formData = {
        ...form,
        customerBranchId: customerBranchId,
      };
      return await axiosInstance.post(`${customerAddressUrl}/`, formData);
    },
    deleteBranchAddress: async (id) => {
      return await axiosInstance.delete(`${customerAddressUrl}/${id}`);
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
  };
};

export default CrmServices;
