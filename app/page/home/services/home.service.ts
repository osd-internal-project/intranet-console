/* import { AxiosInstance } from "axios";
export interface TMaTaskServices {
  // findMaTaskAll: () => Promise<ITMaTask[]>;
  findMasterRoomAll: () => Promise<ITMaTask>;

}
const HomeServices = (axiosInstance: AxiosInstance): TMaTaskServices => {
  const taskUrl = "/ma-task";
  const typeUrl = "/ma-type";

  return {

    findMaTaskById: async (id: number) => {
      return await axiosInstance
        .get(`${taskUrl}/${id}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
}} */
