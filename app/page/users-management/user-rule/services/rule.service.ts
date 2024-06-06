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
    getMasterRuleByFilter: async (search: object) => {
      const condition = {
        where: search,
      };
      return await axiosInstance
        .post(`${baseUrl}/condition`, {
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
    getMasterRuleByRuleId: async (ruleCode: string) => {
      const condition = {
        where: {
          ruleCode: ruleCode,
        },
      };
      return await axiosInstance.post(`${baseUrl}/condition`, {
        condition: condition,
      });
    },
    addMasterRule: async (data: Object) => {
      const req = {
        data: data,
      };
      return await axiosInstance.post(`${baseUrl}`, req);
    },

    updateMasterRule: async (ruleCode: string, data: Object) => {
      const req = {
        ruleCode: ruleCode,
        data: data,
      };
      return await axiosInstance.patch(`${baseUrl}`, req);
    },
    deleteMasterRule: async (ruleCode: string) => {
      return await axiosInstance.delete(`${baseUrl}/${ruleCode}`);
    },
  };
};
export default RuleServices;
