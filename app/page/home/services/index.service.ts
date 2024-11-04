import { AxiosInstance } from "axios";
import { SlideImageType } from "../common";

const SlideImageService = (axiosInstance: AxiosInstance) => {
  const baseUrlSlideImage = "/slide-image";
  const baseUrlApiMasterRoom = "/master-room";
  const baseUrlApiHandbookFile = "/handbook-file";
  const baseUrlApiHandbookType = "/handbook-type";
  const baseUrlApiInformationNews = "/informationNews";
  const baseUrlApiNewsImage = "/news-image";
  const baseUrlApiHoliday = "/holiday";

  return {
    getSlideImageQuery: async () => {
      return await axiosInstance
        .get(`${baseUrlSlideImage}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
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

    getImage: async (id: number) => {
      return await axiosInstance
        .get(`${baseUrlSlideImage}/upload-image/${id}`, { responseType: "blob" })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
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
          return;
        });
    },

    getMasterRoomQuery: async () => {
      return await axiosInstance
        .get(`${baseUrlApiMasterRoom}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return;
        });
    },
    getHandbookFileQuery: async () => {
      return await axiosInstance
        .post(`${baseUrlApiHandbookFile}/fileAlls`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return;
        });
    },

    getHandbookTypeQuery: async () => {
      return await axiosInstance
        .get(`${baseUrlApiHandbookType}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return;
        });
    },

    downloadFile: async (id: number) => {
      return await axiosInstance
        .get(`${baseUrlApiHandbookFile}/get-file/${id}`, {
          responseType: "blob",
        })
        .then((result) => {
          return result.data;
        })
        .catch((err) => {
          return;
        });
    },

    getinformationNewsQuery: async () => {
      return await axiosInstance
        .get(`${baseUrlApiInformationNews}/home/news`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return;
        });
    },
    getNewsImageQuery: async (newsId?: any) => {
      return await axiosInstance
        .get(`${baseUrlApiNewsImage}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return;
        });
    },
    getHoliday: async (year: string) => {
      return await axiosInstance
        .get(`${baseUrlApiHoliday}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return;
        });
    },
  };
};

export default SlideImageService;
