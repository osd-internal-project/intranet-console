import { TablePaginationConfig } from "antd";
import { AxiosInstance } from "axios";

const EmployeeProfileDetail = (axiosInstance: AxiosInstance) => {
  const baseHrUrl = "employee-profile";
  return {
    getEmployeeProfileAll: async (pagination: TablePaginationConfig) => {
      const { total, pageSize, current } = pagination;
      const pagesize = pageSize || 10;
      const currents = current || 1;
      let skip = (currents - 1) * pagesize;
      return await axiosInstance
        .get(`${baseHrUrl}/${pageSize}/${skip}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getCount: async (params: { valueOne: {}; valueTwo: boolean; valueThree: boolean; valueFour: string }) => {
      return await axiosInstance
        .get(`${baseHrUrl}/count`, { params: params })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getImage: async (userId: string) => {
      return await axiosInstance
        .get(`${baseHrUrl}/upload-image/${userId}`, { responseType: "blob" })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    createProfile: async (values: any) => {
      return await axiosInstance
        .post(`${baseHrUrl}`, values)
        .then((res) => {
          return res.data;
        });
    },
    createImageProfile: async (userId: string, formdata: any) => {
      return await axiosInstance
        .post(`${baseHrUrl}/upload-image/${userId}`, formdata, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          return res.data;
        });
    },
  };
};

export default EmployeeProfileDetail;
