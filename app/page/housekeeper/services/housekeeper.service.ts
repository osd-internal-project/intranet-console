import { AxiosInstance } from "axios";

export const HouseKeeperStockServices = (axiosInstance: AxiosInstance) => {
  const baseUrlApiResultCleanlines = "/result-cleanlines";
  const baseUrlApiFloor = "/floor";
  const baseUrlApiHousekeeper = "/housekeeper";
  const baseUrlApiHousekeeperReport = "/report-house-keeper";

  return {
    createEvent: async (body: any) => {
      return await axiosInstance
        .post(`${baseUrlApiResultCleanlines}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return 200;
        });
    },
    getEventByMonth: async (param: any) => {
      const params = param;
      return await axiosInstance
        .get(`${baseUrlApiResultCleanlines}/query`, { params })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getFloor: async () => {
      return await axiosInstance
        .get(`${baseUrlApiFloor}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getHousekeeper: async () => {
      return await axiosInstance
        .get(`${baseUrlApiHousekeeper}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getHousekeeperQuery: async (param: any) => {
      const params = param;
      return await axiosInstance
        .get(`${baseUrlApiHousekeeper}/query`, { params })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getHousekeeperCount: async (param: any) => {
      const params = param;
      return await axiosInstance
        .get(`${baseUrlApiHousekeeper}/count`, { params })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    createHousekeeper: async (body: any) => {
      return await axiosInstance
        .post(`${baseUrlApiHousekeeper}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    updateHousekeeper: async (body: any) => {
      return await axiosInstance
        .patch(`${baseUrlApiHousekeeper}/${body.houseKeeperId}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getFloorQuery: async (param: any) => {
      const params = param;
      return await axiosInstance
        .get(`${baseUrlApiFloor}/query`, { params })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getFloorCount: async (param: any) => {
      const params = param;
      return await axiosInstance
        .get(`${baseUrlApiFloor}/count`, { params })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    createFloor: async (body: any) => {
      return await axiosInstance
        .post(`${baseUrlApiFloor}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    updateFloor: async (body: any) => {
      return await axiosInstance
        .patch(`${baseUrlApiFloor}/${body.floorId}`, body)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getReport: async (param: any) => {
      const params = param;
      return await axiosInstance
        .get(`${baseUrlApiHousekeeperReport}/query`, { params })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    exportReport: async (body: any) => {
      return await axiosInstance
        .post(`${baseUrlApiHousekeeperReport}/export`, { body }, { responseType: "arraybuffer" })
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
