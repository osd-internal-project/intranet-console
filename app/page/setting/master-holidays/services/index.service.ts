import { AxiosInstance } from "axios";
import { ICreateMasterHolidayDto, ICreateMasterHolidayYearDto } from "../common";
const MasterHolidaysService = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/master-holidays";
  const baseUrlYear = "/master-holidays-year";

  return {
    getAllYear: async () => {
      return await axiosInstance
        .get(`${baseUrlYear}`)
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getHolidayByYear: async (year: string) => {
      return await axiosInstance
        .get(`${baseUrl}/year/${year}`)
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    deleteMasterHoliday: async (id: number) => {
      return await axiosInstance
        .delete(`${baseUrl}/${id}`)
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    createMasterHolidaysYear: async (event: ICreateMasterHolidayYearDto) => {
      return await axiosInstance
        .post(`${baseUrlYear}`, event)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    createMasterHolidays: async (event: ICreateMasterHolidayDto) => {
      return await axiosInstance
        .post(`${baseUrl}`, event)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    validateNameYear: async (holidaysYear: string) => {
      return await axiosInstance
        .post(`${baseUrlYear}/validate-name`, { holidaysYear: holidaysYear })
        .then((response) => response.data.message)
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
  };
};
export default MasterHolidaysService;
