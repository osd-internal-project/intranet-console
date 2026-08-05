import { AxiosInstance } from "axios";

export const MaCarFuelTransactionServices = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/ma-car-fuel-transaction";

  return {
    /**
     * Fetch all fuel transactions.
     */
    findAll: async () => {
      return await axiosInstance
        .get(baseUrl)
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    /**
     * Fetch all fuel transactions for a specific car.
     * @param carId - The car's unique identifier
     */
    findManyByCarId: async (carId: string) => {
      return await axiosInstance
        .get(`${baseUrl}/${carId}`)
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    /**
     * Create a new fuel transaction.
     * @param body - The fuel transaction data to create
     */
    create: async (body: any) => {
      return await axiosInstance
        .post(baseUrl, body)
        .then((res) => res.data);
    },

    /**
     * Update a fuel transaction by carId.
     * @param carId - The car's unique identifier
     * @param body - The updated fuel transaction data
     */
    update: async (carId: string, body: any) => {
      return await axiosInstance
        .patch(`${baseUrl}/${carId}`, body)
        .then((res) => res.data);
    },

    /**
     * Delete a fuel transaction by carId.
     * @param carId - The car's unique identifier
     */
    remove: async (carId: string) => {
      return await axiosInstance
        .delete(`${baseUrl}/${carId}`)
        .then((res) => res.data);
    },
  };
};
