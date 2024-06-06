import { AxiosInstance } from "axios";

export const BookingRoomServices = (axiosInstance: AxiosInstance) => {
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
        createBookingRoom: async (body: any) => {
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
    }
}
