import { AxiosInstance } from "axios";
import { ITCustomer, ITCustomerForm } from "../common";
export interface TMaServices {
  findCustomerList: () => Promise<ITCustomer[]>;
  findCustomerByCustomerId: (id: number) => Promise<ITCustomer>;
  create: (form: ITCustomerForm) => Promise<ITCustomer>;
  update: (id: number, form: ITCustomerForm) => Promise<ITCustomer>;
  delete: (id: number) => Promise<ITCustomerForm>;
}
const MaTypesServices = (axiosInstance: AxiosInstance): TMaServices => {
  const customerUrl = "/customer-detail";
  return {
    findCustomerList: async () => {
      return await axiosInstance
        .get(`${customerUrl}/many`)
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
  };
};

export default MaTypesServices;
