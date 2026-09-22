import { AxiosInstance } from "axios";
import { Dayjs } from "dayjs";

export const BookingRoomServices = (axiosInstance: AxiosInstance) => {
  const baseUrlApiBookingRoom = "/booking-room";
  const baseUrlApiMasterRoom = "/master-room";
  const baseUrlApiOrganizeChart = "/organize-chart";
  const baseUrlApiMasterRefreshment = "/refreshment";

  return {
    getBookingRoomQuery: async () => {
      return await axiosInstance
        .get(`${baseUrlApiBookingRoom}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getBookingRoomCarlendar: async (month: Date | Dayjs | string) => {
      const condition = {
        month,
      };
      return await axiosInstance
        .get(`${baseUrlApiBookingRoom}/calendar`, { params: condition })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findBookingRoom: async (skip: number, take: number) => {
      return await axiosInstance
        .get(`${baseUrlApiBookingRoom}?take=${take}&skip=${skip}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    createBookingRoom: async (body: any) => {
      return await axiosInstance
        .post(`${baseUrlApiBookingRoom}`, body)
        .then((res) => {
          return res.data;
        });
    },
    updateBookingRoom: async (id: string | number, body: any) => {
      return await axiosInstance
        .patch(`${baseUrlApiBookingRoom}/${id}`, body)
        .then((res) => {
          return res.data;
        });
    },
    getMasterRoomQuery: async () => {
      return await axiosInstance
        .get(`${baseUrlApiMasterRoom}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    countBookingRoomCountByRoomAndRange: async (roomId: string, startDate: string | Date | Dayjs, endDate: string | Date | Dayjs) => {
      return await axiosInstance
        .get(`${baseUrlApiBookingRoom}/count-by-room-and-range`, {
          params: { roomId, startDate, endDate },
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getOrganizeChartQuery: async () => {
      return await axiosInstance
        .get(`${baseUrlApiOrganizeChart}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    getMasterRefreshmentQuery: async () => {
      return await axiosInstance
        .get(`${baseUrlApiMasterRefreshment}`)
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
