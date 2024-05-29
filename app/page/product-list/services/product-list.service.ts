import { AxiosInstance } from "axios";
import { ITypeMasterProduct } from "../common";
const MasterProductServices = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/master-product";
  const locationUrl = "/location";
  const imageUrl = "/master-product-image";
  const masterdataApiInventoryLot = "/inventory-lot";
  const imageGhsUrl = "/master-ghs-type";
  const filesUrl = "/master-product-files";
  return {
    getLocation: async () => {
      return await axiosInstance
        .post(`${locationUrl}/condition`, { condition: { where: { status: true } } })
        .then((result) => result.data)
        .catch((err) => console.log(err));
    },
    getMasterProducts: async (condition: object) => {
      return await axiosInstance
        .post(`${baseUrl}/condition`, { condition: condition })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },

    getMasterProductsByLocationId: async (locationId: number | undefined, values: any, getswitch: boolean) => {
      const condition = { locationId: locationId, condition: values?.length === 0 ? {} : values, minimumStatus: getswitch };
      return await axiosInstance
        .post(`${baseUrl}/location`, condition)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },

    getInventorylotByInventorystockId: async (InventorystockId: string, search: object) => {
      const condition = {
        condition: {
          where: {
            inventoryStockId: Number(InventorystockId),
            ...search,
          },
          include: {
            inventoryStock: {
              select: { masterProduct: { select: { unit: true } } },
            },
            fileRecieve: true,
          },

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
    getProductQtyOfDepartmentByInventorystockId: async (productId: number) => {
      return await axiosInstance
        .post(`${baseUrl}/inventory-find-by-product`, { productId: productId })
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
        .get(`${imageUrl}/get_image?image=${condition}`, { responseType: "blob" })
        .then((result) => result.data)
        .catch((err) => console.log(err));
    },
    dataImagesGhs: async (condition: any) => {
      return await axiosInstance
        .get(`${imageGhsUrl}/get_image/ghs?image=${condition}`, { responseType: "blob" })
        .then((result) => result.data)
        .catch((err) => console.log(err));
    },
    remove: async (id: number) => {
      return await axiosInstance
        .delete(`${baseUrl}/${id}`)
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
    downloadfile: async (id: number) => {
      return await axiosInstance
        .get(`${filesUrl}/download/${id}`, { responseType: "blob" })
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

export default MasterProductServices;
