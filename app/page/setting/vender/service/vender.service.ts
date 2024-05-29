import { AxiosInstance } from "axios";
type updatecontact = {
  contactID: string;
  contact_name: string;
  phoneNumber: string;
  fax_number: string;
  email: string;
  description: string;
};
export const VenderServices = (axiosInstance: AxiosInstance) => {
  return {
    getAll: async () => {
      return await axiosInstance
        .get(`/vender`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getById: async (id: string) => {
      const condition = {
        where: {
          venderID: id,
        },
      };
      return await axiosInstance
        .post(`/vender/condition-findfirst`, { condition: condition })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getByCondition: async (filter: any) => {
      const condition = {
        where: filter,
      };
      return await axiosInstance
        .post(`/vender/condition`, {
          condition: condition,
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    createVender: async (condition: any) => {
      const contact: updatecontact = condition.contact !== undefined ? condition.contact.filter((value: any) => value !== undefined) : undefined;
      const data = { ...condition };
      delete data["contact"];
      const res = {
        vender: data,
        contact,
      };
      return await axiosInstance
        .post(`/vender`, res)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    updatedata: async (data: any, numberId: string) => {
      const number = numberId;
      const contact: updatecontact = data.contact !== undefined ? data.contact.filter((value: updatecontact) => value !== undefined) : undefined;
      const res = { ...data };
      delete res["contact"];
      const ressultJson = {
        number,
        vender: res,
        contact,
      };

      return await axiosInstance
        .patch(`/vender`, ressultJson)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    delete: async (venderID: string) => {
      return await axiosInstance
        .delete(`/vender/${venderID}`)
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
