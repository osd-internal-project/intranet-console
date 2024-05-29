import { AxiosInstance } from "axios";
const MasterHazardTypeService = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/master-hazard-type";
  return {
    getdataAllHazard: async () => {
      return await axiosInstance
        .get(`${baseUrl}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getdataAll: async (search: any) => {
      const condition = {
        where: search,
        orderBy: { id: "asc" },
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
    getdataByID: async (id: string) => {
      const condition = {
        where: {
          id: id,
        },
      };
      return await axiosInstance.post(`${baseUrl}/condition`, {
        condition: condition,
      });
    },

    createHazardType: async (data: Object) => {
      const req = {
        data: data,
      };
      return await axiosInstance
        .post(`${baseUrl}`, req)
        .then((result) => result.data)
        .catch((err) => err);
    },

    updateHazardType: async (data: any) => {
      return await axiosInstance.patch(`${baseUrl}`, data);
    },
    deleteMasterGhs: async (id: string) => {
      return await axiosInstance.delete(`${baseUrl}/${id}`);
    },
  };
};
export default MasterHazardTypeService;
