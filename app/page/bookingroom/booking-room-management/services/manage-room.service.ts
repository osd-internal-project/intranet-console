import { AxiosInstance } from "axios";

export const ManageRoomServices = (axiosInstance: AxiosInstance) => {
  const baseUrlApiBookingRoom = "/booking-room";
  const baseUrlApiMasterRoom = "/master-room";

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
        .get(`${baseUrlApiBookingRoom}?take=${take}&skip=${skip}&role=admin`)
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
    updateBooking: async (body: any) => {
      return await axiosInstance
        .patch(`${baseUrlApiBookingRoom}/${body.id}`, body)
        .then((res) => {
          return res.data;
        });
    },

    deleteBooking: async (id: any) => {
      return await axiosInstance
        .delete(`${baseUrlApiBookingRoom}/${id}`)
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

    updateMasterRoom: async (body: any) => {
      return await axiosInstance
        .patch(`${baseUrlApiMasterRoom}/${body.id}`, body)
        .then((res) => {
          return res.data;
        });
    },
    deleteMasterRoom: async (id: any) => {
      console.log(`${baseUrlApiMasterRoom}/${id}`);
      return await axiosInstance
        .delete(`${baseUrlApiMasterRoom}/${id}`)
        .then((res) => {
          return res.data;
        });
    },
  };
};
