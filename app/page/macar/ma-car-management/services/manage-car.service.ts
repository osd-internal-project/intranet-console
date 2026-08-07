import { AxiosInstance } from "axios";
import { MaCarBookType, MaCarWrapupType } from "../../common";

/** ผลลัพธ์ตารางแบ่งหน้าของการจองรถต่อคัน — docs = แถวหน้าปัจจุบัน, total = จำนวนทั้งหมด */
export interface MaCarBookByCarResult {
  docs: MaCarBookType[];
  total: number;
}

/** ผลลัพธ์ตารางแบ่งหน้าของประวัติตรวจสภาพต่อคัน — data = แถวหน้าปัจจุบัน, count = จำนวนทั้งหมด */
export interface MaCarWrapupByCarResult {
  data: MaCarWrapupType[];
  count: number;
}

/** 1 แถวของ log กิจกรรมรถ */
export interface TCarActivityLog {
  id: number;
  carId: string;
  carName?: string | null;
  type: string;
  action: string;
  refId?: string | null;
  description?: string | null;
  detail?: unknown;
  actorId?: string | null;
  actorName?: string | null;
  createdAt: string;
}

/** ผลลัพธ์ประวัติกิจกรรมรถแบ่งหน้า */
export interface CarActivityByCarResult {
  data: TCarActivityLog[];
  count: number;
}

export const ManageCarServices = (axiosInstance: AxiosInstance) => {
  const baseUrlApiMaCarBook = "/ma-car-book";
  const baseUrlApiMaCar = "/ma-car";
  const baseUrlApiMaCarTpye = "/ma-car-type";
  const baseUrlApiMaCarwarpup = "/ma-car-wrapup";
  const baseUrlApiMaCarwarpupimage = "/ma-car-wrapup-image";
  const baseUrlApiMaCarFiles = "/ma-car-files";
  const baseUrlApiCarActivity = "/car-activity-log";

  return {
    /** ประวัติกิจกรรมของรถ 1 คัน แบบแบ่งหน้า → { data, count } */
    getCarActivity: async (
      carId: string,
      skip: number,
      take: number,
    ): Promise<CarActivityByCarResult> =>
      await axiosInstance
        .get(`${baseUrlApiCarActivity}/car/${carId}`, { params: { skip, take } })
        .then((res) => res.data as CarActivityByCarResult)
        .catch((err) => {
          console.log(err);
          return { data: [], count: 0 };
        }),

    getMaCarBookQuery: async () => {
      return await axiosInstance
        .get(`${baseUrlApiMaCarBook}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    findMaCarBookForApprove: async (
      filters: {
        carBookApprovedStatus?: string;
        carBookStartDate?: Date | string;
        createdByName?: string;
      },
      skip: number,
      take: number,
    ) => {
      return await axiosInstance
        .get(`${baseUrlApiMaCarBook}/approve/${skip}/${take}`, {
          params: filters,
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findMaCarBook: async (skip: number, take: number) => {
      return await axiosInstance
        .get(`${baseUrlApiMaCarBook}/${skip}/${take}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    /**
     * รายการจองแบ่งหน้าของรถ 1 คัน — ส่ง skip/take เป็น query param เพื่อ query ใหม่ทุกครั้งที่เปลี่ยนหน้า/ขนาดหน้า
     * @param carId รหัสรถ
     * @param skip จำนวนแถวที่ข้าม = (หน้า-1) * ขนาดหน้า
     * @param take จำนวนแถวต่อหน้า
     * @returns { docs, total } — คืนค่าว่างเมื่อเรียกไม่สำเร็จ
     */
    findMaCarBookByCarId: async (
      carId: string,
      skip: number,
      take: number,
    ): Promise<MaCarBookByCarResult> => {
      return await axiosInstance
        .get(`${baseUrlApiMaCarBook}/car/${carId}`, { params: { skip, take } })
        .then((res) => res.data as MaCarBookByCarResult)
        .catch((err) => {
          console.log(err);
          return { docs: [], total: 0 };
        });
    },
     getMaCarFilesByCarId: async (carId: string) => {
      return await axiosInstance
        .get(`${baseUrlApiMaCarFiles}/car/${carId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getMaCarWrapupByCarId: async (carId: string) => {
      return await axiosInstance
        .get(`${baseUrlApiMaCarwarpup}/car/${carId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findOneMaCarBook: async (body: any) => {
      return await axiosInstance
        .get(`${baseUrlApiMaCarBook}/${body}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    createMaCarBook: async (body: any) => {
      return await axiosInstance
        .post(`${baseUrlApiMaCarBook}`, body)
        .then((res) => {
          return res.data;
        });
    },

    updateMaCarBook: async (body: any) => {
      return await axiosInstance
        .patch(`${baseUrlApiMaCarBook}/${body.id}`, body)
        .then((res) => {
          return res.data;
        });
    },
    deleteMaCarBook: async (carId: any) => {
      return await axiosInstance
        .delete(`${baseUrlApiMaCarBook}/${carId}`)
        .then((res) => {
          return res.data;
        });
    },
    getMaCarQuery: async () => {
      return await axiosInstance
        .get(`${baseUrlApiMaCar}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getMaCarQueryByCarId: async (carId: string) => {
      return await axiosInstance
        .get(`${baseUrlApiMaCar}/${carId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    
    updateMaCar: async (carId: string, body: any) => {
      return await axiosInstance
        .patch(`${baseUrlApiMaCar}/${carId}`, body)
        .then((res) => {
          return res.data;
        });
    },
    createMaCar: async (body: any) => {
      return await axiosInstance
        .post(`${baseUrlApiMaCar}`, body)
        .then((res) => {
          return res.data;
        });
    },
    deleteMaCar: async (carId: string) => {
      return await axiosInstance
        .delete(`${baseUrlApiMaCar}/${carId}`)
        .then((res) => {
          return res.data;
        });
    },
    // ma car type
    getMaCarQueryType: async () => {
      return await axiosInstance
        .get(`${baseUrlApiMaCarTpye}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getImages: async (carWrapupID: string) => {
      return await axiosInstance
        .get(`${baseUrlApiMaCarwarpupimage}/get-file/${carWrapupID}`, {
          responseType: "blob",
        })
        .then((result) => result.data)
        .catch((err) => console.log(err));
    },
    updateMaCarType: async (id: string, body: any) => {
      return await axiosInstance
        .patch(`${baseUrlApiMaCarTpye}/${id}`, body)
        .then((res) => {
          return res.data;
        });
    },
    createMaCarType: async (body: any) => {
      return await axiosInstance
        .post(`${baseUrlApiMaCarTpye}`, body)
        .then((res) => {
          return res.data;
        });
    },
    deleteMaCarType: async (carId: any) => {
      console.log(`${baseUrlApiMaCarTpye}/${carId}`);
      return await axiosInstance
        .delete(`${baseUrlApiMaCarTpye}/${carId}`)
        .then((res) => {
          return res.data;
        });
    },
    getMaCarQueryWarpup: async () => {
      return await axiosInstance
        .get(`${baseUrlApiMaCarwarpup}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    /**
     * ประวัติตรวจสภาพแบ่งหน้าของรถ 1 คัน — ส่ง skip/take เป็น query param เพื่อ query ใหม่ทุกครั้งที่เปลี่ยนหน้า/ขนาดหน้า
     * @param carId รหัสรถ
     * @param skip จำนวนแถวที่ข้าม = (หน้า-1) * ขนาดหน้า
     * @param take จำนวนแถวต่อหน้า
     * @returns { data, count } — คืนค่าว่างเมื่อเรียกไม่สำเร็จ
     */
    findMaCarWrapupByCarId: async (
      carId: string,
      skip: number,
      take: number,
    ): Promise<MaCarWrapupByCarResult> => {
      return await axiosInstance
        .get(`${baseUrlApiMaCarwarpup}/car/${carId}`, { params: { skip, take } })
        .then((res) => res.data as MaCarWrapupByCarResult)
        .catch((err) => {
          console.log(err);
          return { data: [], count: 0 };
        });
    },
    updateMaCarWarpup: async (carWrapupId: string, body: any) => {
      return await axiosInstance
        .patch(`${baseUrlApiMaCarwarpup}/${carWrapupId}`, body)
        .then((res) => {
          return res.data;
        });
    },
    createMaCarWarpup: async (body: any) => {
      return await axiosInstance
        .post(`${baseUrlApiMaCarwarpup}`, body)
        .then((res) => {
          return res.data;
        });
    },
    deleteMaCarWarpup: async (carId: any) => {
      console.log(`${baseUrlApiMaCarTpye}/${carId}`);
      return await axiosInstance
        .delete(`${baseUrlApiMaCarwarpup}/${carId}`)
        .then((res) => {
          return res.data;
        });
    },

    getMaCarQueryWarpupimage: async () => {
      return await axiosInstance
        .get(`${baseUrlApiMaCarwarpupimage}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    updateMaCarWarpupimage: async (carWrapupId: string, body: any) => {
      return await axiosInstance
        .patch(`${baseUrlApiMaCarwarpupimage}/${carWrapupId}`, body)
        .then((res) => {
          return res.data;
        });
    },
    uploadFiles: async (carWrapupId: string, formData: FormData) => {
      return axiosInstance.post(
        `${baseUrlApiMaCarwarpupimage}/${carWrapupId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
    },

    createMaCarWarpupimage: async (body: any) => {
      return await axiosInstance
        .post(`${baseUrlApiMaCarwarpupimage}`, body)
        .then((res) => {
          return res.data;
        });
    },
    deleteMaCarWarpupimage: async (idwarpupImage: any) => {
      console.log(`${baseUrlApiMaCarTpye}/${idwarpupImage}`);
      return await axiosInstance
        .delete(`${baseUrlApiMaCarwarpupimage}/${idwarpupImage}`)
        .then((res) => {
          return res.data;
        });
    },
    uploadFilesDoc: async (carId: string, body: any) => {
      return await axiosInstance
        .post(`${baseUrlApiMaCarFiles}/${carId}`, body, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          return res.data;
        });
    },

    /** ลบไฟล์แนบของรถ 1 รายการ (backend ลบ object ใน MinIO ให้ด้วย) */
    deleteFileDoc: async (id: number) => {
      return await axiosInstance
        .delete(`${baseUrlApiMaCarFiles}/${id}`)
        .then((res) => res.data);
    },
  };
};
