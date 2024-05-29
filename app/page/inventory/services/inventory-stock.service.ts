import { AxiosInstance } from "axios";

export const InventoryStockServices = (axiosInstance: AxiosInstance) => {
  const masterdataApiInventory = "/inventory";
  const masterdataApiInventoryStock = "/inventory-stock";
  const masterdataApiInventoryLot = "/inventory-lot";
  const masterdatamasterProduct = "/master-product";
  const masterdatamasterProductImage = "/master-product-image";
  const masterProductFilesUrl = "/master-product-files";
  return {
    getInventoryByGroup: async (userGroup: [], search: object) => {
      return await axiosInstance
        .post(`${masterdataApiInventory}/find-by-user-group`, { search: search, userGroup: userGroup })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getInventoryByInventoryID: async (inventoryID: string, search: any, getswitch: boolean) => {
      const condition = {
        inventoryId: Number(inventoryID),
        condition: search,
        minimumstatus: getswitch,
      };
      console.log(getswitch);
      return await axiosInstance
        .post(`${masterdatamasterProduct}/inventory`, condition)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getreciepdateLast: async (inventorystockId: number) => {
      const data = {
        condition: {
          where: {
            inventoryStockId: inventorystockId,
          },
          orderBy: [{ receiptDate: "desc" }],
        },
      };
      return await axiosInstance
        .post(`${masterdataApiInventoryLot}/condition-first`, data)
        .then((result) => result.data)
        .catch((err) => console.log(err));
    },
    getInventorylotByInventorystockId: async (inventorystockId: string) => {
      return await axiosInstance
        .get(`${masterdataApiInventoryStock}/find-lot/${inventorystockId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getInventorylotByInventorystockIdFilter: async (InventorystockId: string, search: object) => {
      const condition = {
        condition: {
          where: {
            inventoryStockId: Number(InventorystockId),
            ...search,
          },
          include: { fileRecieve: true },
          orderBy: [
            {
              receiptDate: "desc",
            },
          ],
        },
      };
      return await axiosInstance
        .post(`${masterdataApiInventoryLot}/condition`, condition)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    getImages: async (condition: any) => {
      return await axiosInstance
        .get(`${masterdatamasterProductImage}/get_image/?image=${condition}`, { responseType: "blob" })
        .then((result) => result.data)
        .catch((err) => console.log(err));
    },

    createStock: async (condition: any) => {
      return await axiosInstance
        .post(`${masterdataApiInventoryStock}`, condition)
        .then((result) => result.data)
        .catch((err) => console.log(err));
    },

    createFilerecieve: async (id: string, dataupload: any) => {
      return axiosInstance
        .post(`${masterdataApiInventoryStock}/images/${id}`, dataupload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((result) => result.data)
        .catch((err) => err);
    },

    updateStock: async (condition: any) => {
      return await axiosInstance
        .patch(`${masterdataApiInventoryStock}`, condition)
        .then((result) => result.data)
        .catch((err) => console.log(err));
    },

    getcountInventoryStock: async (inventoryid: string, productid: string) => {
      return await axiosInstance
        .get(`${masterdataApiInventoryStock}/count-inventory-stock?inventoryid=${inventoryid}&productid=${productid}`)
        .then((result) => result.data)
        .catch((err) => console.log(err));
    },

    getUsableRemain: async (inventorystockId: number) => {
      return await axiosInstance
        .get(`${masterdataApiInventoryLot}/find-usable-remain-by-inventorystock?stockid=${inventorystockId}`)
        .then((result) => result.data)
        .catch((err) => console.log(err));
    },
    getExpiredRemain: async (inventorystockId: number) => {
      return await axiosInstance
        .get(`${masterdataApiInventoryLot}/find-expired-remain-by-inventorystock?stockid=${inventorystockId}`)
        .then((result) => result.data)
        .catch((err) => console.log(err));
    },
    delete: async (venderID: string) => {
      return await axiosInstance
        .delete(`/vender/${venderID}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getBrand: async () => {
      return await axiosInstance
        .get(`/brand`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    getVender: async () => {
      return await axiosInstance
        .get(`/vender`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    downloadfile: async (id: number) => {
      return await axiosInstance
        .get(`${masterProductFilesUrl}/download/${id}`, { responseType: "blob" })
        .then((result) => result.data)
        .catch((err) => console.log(err));
    },
    downloadfileRecieve: async (id: number) => {
      return await axiosInstance
        .get(`${masterdataApiInventoryLot}/download/${id}`, { responseType: "blob" })
        .then((result) => result.data)
        .catch((err) => console.log(err));
    },
  };
};
