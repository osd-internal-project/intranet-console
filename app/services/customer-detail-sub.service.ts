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
} from "../common/customer";
import { ITProject } from "../common/project";
export interface TCrmServices {
  findManyByCustomerId: (
    customerId: number,
    search: object
  ) => Promise<ITCustomerDetailSubDetail[]>;
  findManyByCustomerSubId: (
    customerSubId: number,
    condition: object
  ) => Promise<ITCustomerDetailSub[]>;
  findDetailByCustomerDetailSubId: (branchId: number) => Promise<ITCustomerDetailSubDetail>;
  create: (
    customerId: number,
    customerSubId: number,
    branchForm: ITCustomerDetailSubForm
  ) => Promise<ITCustomerDetailSub>;
  update: (id: number, branchForm: ITCustomerDetailSubForm) => Promise<ITCustomerDetailSub>;
  delete: (id: number) => Promise<ITCustomerDetailSub>;
  createCustomerDetailSubAddress: (
    customerCustomerDetailSubId: number,
    address: ITCustomerDetailSubAddressForm
  ) => Promise<ITCustomerDetailSubAddress>;
  deleteCustomerDetailSubAddress: (addressId: number) => Promise<ITCustomerDetailSubAddress>;
  createCustomerDetailSubContact: (
    customerCustomerDetailSubId: number,
    contact: ITCustomerDetailSubContactForm
  ) => Promise<ITCustomerDetailSubAddress>;
  deleteCustomerDetailSubContact: (contactId: number) => Promise<ITCustomerDetailSubContact>;
}
const CrmServices = (axiosInstance: AxiosInstance): TCrmServices => {
  const customerCustomerDetailSubUrl = "/customer-detail-sub";
  const customerAddressUrl = "/customer-address";
  const customerContactUrl = "/customer-contact";
  return {
    findManyByCustomerId: async (customerId, search) => {
      return await axiosInstance
        .get(`${customerCustomerDetailSubUrl}/detail-list-by-customer/${customerId}`, {
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
          `${customerCustomerDetailSubUrl}/detail-list-by-customer-sub/${customerSubId}`,
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
    findDetailByCustomerDetailSubId: async (branchId) => {
      return await axiosInstance
        .get(`${customerCustomerDetailSubUrl}/detail/${branchId}`)
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
      return await axiosInstance.post(`${customerCustomerDetailSubUrl}/`, formData);
    },
    update: async (id, form) => {
      const formData = {
        ...form,
      };
      return await axiosInstance.patch(`${customerCustomerDetailSubUrl}/${id}`, formData);
    },
    delete: async (id) => {
      return await axiosInstance.delete(`${customerCustomerDetailSubUrl}/${id}`);
    },
    createCustomerDetailSubAddress: async (customerCustomerDetailSubId, form) => {
      const formData = {
        ...form,
        customerCustomerDetailSubId: customerCustomerDetailSubId,
      };
      return await axiosInstance.post(`${customerAddressUrl}/`, formData);
    },
    deleteCustomerDetailSubAddress: async (id) => {
      return await axiosInstance.delete(`${customerAddressUrl}/${id}`);
    },
    createCustomerDetailSubContact: async (customerCustomerDetailSubId, form) => {
      const formData = {
        ...form,
        customerCustomerDetailSubId: customerCustomerDetailSubId,
      };
      return await axiosInstance.post(`${customerContactUrl}/`, formData);
    },
    deleteCustomerDetailSubContact: async (id) => {
      return await axiosInstance.delete(`${customerContactUrl}/${id}`);
    },
  };
};

export default CrmServices;
