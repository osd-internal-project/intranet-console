import { AxiosInstance } from "axios";
import { ITExpenseType, ITTicketExpense } from "../common";
import { ITMaTaskFiles } from "@/app/page/maintenance-management/common";
export interface TMaServices {
  findByUserId: (
    userId: string,
    search: object,
    take: number,
    skip: number
  ) => Promise<{ data: ITTicketExpense[]; count: number }>;
  findExpenseType: () => Promise<ITExpenseType[]>;
  updateProjectTicketExpense: (
    expenseId: number,
    form: any
  ) => Promise<ITTicketExpense>;
  deleteProjectTicketExpense: (expenseId: number) => Promise<ITTicketExpense>;
}
const CrmServices = (axiosInstance: AxiosInstance): TMaServices => {
  const customerUrl = "/customer-detail";
  const projectTicketUrl = "/customer-project-ticket";

  return {
    findByUserId: async (userId, search, take, skip) => {
      return await axiosInstance
        .get(`${projectTicketUrl}/expense/user/${userId}`, {
          params: { ...search, take: take, skip: skip },
        })
        .then((res) => res.data);
    },
    findExpenseType: async () => {
      return await axiosInstance
        .get(`${customerUrl}/config/expense-type`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    },
    updateProjectTicketExpense: async (expenseId, form) => {
      const formData = {
        ...form,
      };
      return await axiosInstance
        .patch(`${projectTicketUrl}/expense/${expenseId}`, formData)
        .then((res) => res.data);
    },
    deleteProjectTicketExpense: async (expenseId: number) => {
      return await axiosInstance.delete(
        `${projectTicketUrl}/expense/${expenseId}`
      );
    },
  };
};

export default CrmServices;
