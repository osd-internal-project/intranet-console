import { AxiosInstance } from "axios";

const RuleServices = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/master-rule";
  return {
    getMasterRuleAll: async () => {
      return await axiosInstance
        .post(`${baseUrl}/condition`)
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
export default RuleServices;
