import { AxiosInstance } from "axios";
import { ITNotiLogsMessage } from "../common/noti-logs";

export interface TServices {
  findByUsers: (userid: string) => Promise<ITNotiLogsMessage[]>;
}
const Services = (axiosInstance: AxiosInstance): TServices => {
  const baseUrl = "/noti-logs";
  return {
    findByUsers: async (userid) => {
      return await axiosInstance
        .get(`${baseUrl}/user/${userid}`)
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
export default Services;
