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
    condition: object
  ) => Promise<ITBranch[]>;
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
}
const CrmServices = (axiosInstance: AxiosInstance): TCrmServices => {
  const customerBranchUrl = "/customer-branch";
  return {
    findManyByCustomerId: async (customerId, condition) => {
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
  };
};

export default CrmServices;
