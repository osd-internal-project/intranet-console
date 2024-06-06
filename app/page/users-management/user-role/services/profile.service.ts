import { AxiosInstance } from "axios";
const ProfileRuleServices = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/profile-rule";
  return {
    getProfileRuleByFilter: async (filter: object) => {
      return await axiosInstance
        .post(`${baseUrl}/search-many`, { filter: filter })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    getProfileRuleOne: async (filter: object) => {
      return await axiosInstance
        .post(`${baseUrl}/search-one`, { filter: filter })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    getProfileRuleByProfileId: async (profileId: string) => {
      const condition = {
        where: {
          profileId: profileId,
        },
      };
      return await axiosInstance.post(`${baseUrl}/condition`, {
        condition: condition,
      });
    },
    addProfileRule: async (profile: Object, rules: string[]) => {
      const req = {
        profile: profile,
        rules: rules,
      };
      return await axiosInstance.post(`${baseUrl}/create-with-rules`, req);
    },

    updateProfileRule: async (profileId: string, profile: Object, rules: string[]) => {
      const req = {
        profileId: profileId,
        profile: profile,
        rules: rules,
      };
      return await axiosInstance.patch(`${baseUrl}/update-with-rules`, req);
    },
    deleteProfileRule: async (profileId: string) => {
      return await axiosInstance.delete(`${baseUrl}/${profileId}`);
    },
  };
};
export default ProfileRuleServices;
