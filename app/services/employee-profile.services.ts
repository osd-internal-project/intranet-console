import { AxiosInstance } from "axios";

const EmployeeProfileDetail = (axiosInstance: AxiosInstance) => {
  const baseHrUrl = "employee-profile";
  return {
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
  };
};

export default EmployeeProfileDetail;
