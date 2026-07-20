import { AxiosInstance } from "axios";

export const MaCarDocumentServices = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/ma-car-document";

  return {
    /**
     * ตาราง matrix แบ่งหน้า — คืน { data (หน้าปัจจุบัน), count, cars (ทุกคัน) }
     * ส่งเฉพาะ param ที่มีค่า; ไม่ส่ง take = ได้ทุกแถว
     */
    getMatrix: async (params?: {
      skip?: number;
      take?: number;
      keyword?: string;
      status?: string;
    }) => {
      const query: Record<string, string> = {};
      if (params?.skip !== undefined) query.skip = String(params.skip);
      if (params?.take !== undefined) query.take = String(params.take);
      if (params?.keyword) query.keyword = params.keyword;
      if (params?.status && params.status !== "all") query.status = params.status;
      return await axiosInstance
        .get(`${baseUrl}/matrix`, { params: query })
        .then(
          (res) =>
            res.data as {
              data: any[];
              count: number;
              cars: { carId: string; carName: string; licensePlate: string | null }[];
            }
        )
        .catch((err) => {
          console.log(err);
          return { data: [], count: 0, cars: [] };
        });
    },

    getSummary: async (year?: number) => {
      return await axiosInstance
        .get(`${baseUrl}/summary`, { params: year ? { year } : undefined })
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return null;
        });
    },

    getChart: async (year?: number) => {
      return await axiosInstance
        .get(`${baseUrl}/chart`, { params: year ? { year } : undefined })
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return null;
        });
    },

    /** ตัวเลือก combobox จากค่าที่เคยบันทึกไว้ */
    getSuggestions: async () => {
      return await axiosInstance
        .get(`${baseUrl}/suggestions`)
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return { vender: [], insuranceType: [] };
        });
    },

    /**
     * รายการเอกสารทั้งหมดแบบ flat สำหรับตาราง Log และ Export — คืน { data, count }
     * ส่ง param เฉพาะที่มีค่า; ส่ง take เพื่อแบ่งหน้า (Export ไม่ส่ง take = ได้ทุกแถว)
     */
    getLog: async (filters: {
      carId?: string;
      docType?: string;
      startDate?: string;
      endDate?: string;
      skip?: number;
      take?: number;
    }) => {
      const params: Record<string, string> = {};
      if (filters.carId) params.carId = filters.carId;
      if (filters.docType) params.docType = filters.docType;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.skip !== undefined) params.skip = String(filters.skip);
      if (filters.take !== undefined) params.take = String(filters.take);
      return await axiosInstance
        .get(`${baseUrl}/log`, { params })
        .then((res) => res.data as { data: any[]; count: number })
        .catch((err) => {
          console.log(err);
          return { data: [], count: 0 };
        });
    },

    /** ประวัติทุกงวดของรถ 1 คัน + เอกสาร 1 ประเภท (รวมแถวที่ยกเลิก) */
    getHistory: async (carId: string, docType: string) => {
      return await axiosInstance
        .get(`${baseUrl}/history/${carId}/${docType}`)
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    /** เพิ่มเอกสารงวดใหม่ — ใช้ทั้งตอนเพิ่มครั้งแรกและตอนต่ออายุ */
    createDocument: async (body: any) => {
      return await axiosInstance
        .post(`${baseUrl}`, body)
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return null;
        });
    },

    updateDocument: async (documentId: string, body: any) => {
      return await axiosInstance
        .patch(`${baseUrl}/${documentId}`, body)
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return null;
        });
    },

    /** ยกเลิกเอกสาร (soft-void) — หายจากตาราง แต่ยังอยู่ในประวัติ */
    voidDocument: async (documentId: string, body: any) => {
      return await axiosInstance
        .patch(`${baseUrl}/${documentId}/void`, body)
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return null;
        });
    },

    uploadFiles: async (documentId: string, formData: FormData) => {
      return await axiosInstance
        .post(`${baseUrl}/${documentId}/files`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    deleteFile: async (id: number) => {
      return await axiosInstance
        .delete(`${baseUrl}/files/${id}`)
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return null;
        });
    },
  };
};
