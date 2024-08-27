import { AxiosInstance } from "axios";
import { SlideImageType } from "../common";

const SlideImageService = (axiosInstance: AxiosInstance) => {
  const baseUrlSlideImage = "/slide-image";

  const getSlideImage = async (filename: string): Promise<Blob> => {
    try {
      const response = await axiosInstance.get(
        `${baseUrlSlideImage}/uploads/image/${filename}`,
        {
          responseType: "blob",
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching slide image:", error);
      throw error;
    }
  };

  return {
    getSlideImage,

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

export default SlideImageService;
