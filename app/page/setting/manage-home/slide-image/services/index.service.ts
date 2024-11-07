import { AxiosInstance } from "axios";
// import { SlideImageType } from "../slide-image/common";

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

    getSlideImageByOrder: async () => {
      return await axiosInstance
        .get(`${baseUrlSlideImage}/order`)
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

    uploadImage: async (formData: any) => {
      return await axiosInstance
        .post(`${baseUrlSlideImage}/upload-image`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
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
    updateTebleSlide: async (fileId: string, data: any) => {
      return await axiosInstance
        .patch(`${baseUrlSlideImage}/order/${fileId}`, data)
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
