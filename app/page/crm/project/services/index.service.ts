import { AxiosInstance } from "axios";
import {
  ITBranchAddress,
  ITBranchAddressForm,
  ITBranchContact,
  ITBranchContactForm,
  ITBranchForSelect,
  ITCustomerForSelect,
} from "../common";
export interface TMaServices {
  findCustomerActive: () => Promise<ITCustomerForSelect[]>;
  findBranchByCustomerId: (customerId: number) => Promise<ITBranchForSelect[]>;
  createProject: (form: ITCustomerForSelect) => Promise<ITCustomerForSelect[]>;
}
const CrmServices = (axiosInstance: AxiosInstance): TMaServices => {
  const customerUrl = "/customer-detail";
  const customerBranchUrl = "/customer-branch";
  const customerProjectUrl = "/customer-project";
  const customerContactUrl = "/customer-contact";
  return {
    findCustomerActive: async () => {
      return await axiosInstance
        .get(`${customerUrl}/active-for-project`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findBranchByCustomerId: async (customerId) => {
      const query = {
        customerDetailId: customerId,
      };
      return await axiosInstance
        .get(`${customerBranchUrl}/both-address-contact/${customerId}`, {})
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    createProject: async (form) => {
      return await axiosInstance.post(`${customerProjectUrl}/`, form);
    },
  };
};

export default CrmServices;
