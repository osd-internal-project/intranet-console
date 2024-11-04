import { AxiosInstance } from "axios";
import {
  ITCustomerGroupForm,
  ITCustomerGroup,
  ITCustomer,
} from "../common/customer";

export interface TServices {
  findCustomerListByCustomerGroup: (
    customerGropId: number,
    search: object
  ) => Promise<{ data: ITCustomer[]; count: number }>;
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
  };
};

export default CrmServices;
