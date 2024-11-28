import { AxiosInstance } from "axios";

export const BookingRoomServices = (axiosInstance: AxiosInstance) => {
  const baseUrlApiBookingRoom = "/booking-room";
  const baseUrlApiMasterRoom = "/master-room";
  const baseUrlApiOrganizeChart = "/organize-chart";

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
      console.log(body);

      return await axiosInstance
        .post(`${baseUrlApiBookingRoom}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
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
    countBookingRoomCountByRoomAndRange: async (
      roomId: string,
      startDate: string,
      endDate: string
    ) => {
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
  };
};
