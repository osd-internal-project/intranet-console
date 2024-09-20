import { AxiosInstance } from "axios";
import { SlideImageType } from "../common";

const ManageHomeService = (axiosInstance: AxiosInstance) => {
  const baseUrlSlideImage = "/slide-image";

  return {
    getSlideImageQuery: async () => {
      return await axiosInstance
        .get(`${baseUrlSlideImage}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    },

    uploadFilesSlide: async (id: number, form: any) => {
      return await axiosInstance
        .post(`${baseUrlSlideImage}/${id}`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((result) => result.data)
        .catch((err) => err);
    },
    createSlideImage: async (body: any) => { 
      return await axiosInstance
        .post(`${baseUrlSlideImage}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return;
        });
    },

    deleteSlideImage: async (id: any) => {
      return await axiosInstance
        .delete(`${baseUrlSlideImage}/${id}`)
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

export default ManageHomeService;
