import { AxiosInstance } from "axios";
import {
  ITCustomerDetailSubForSelect,
  ITCustomerForSelect,
  ITCustomerDetailSubContact,
  ITProjectTaskForm,
  ITProjectTask,
  ITProjectTicket,
  ITProjectTicketEditForm,
  ITProjectCreateForm,
  ITProject,
  ITTicketConfigs,
  ITTicketHistoryLogForm,
  ITExpenseType,
  ITTicketExpense,
} from "../common";
import { ITMaTaskFiles } from "@/app/page/maintenance-management/common";
export interface TMaServices {
  findContactlById: (contactId: number) => Promise<ITCustomerDetailSubContact>;
  findProjectTicketByTaskId: (task: number) => Promise<ITProjectTicket[]>;
  findProjectTicketDetailById: (ticket: number) => Promise<ITProjectTicket>;
  findProjectTicketByProjectId: (
    projectId: number
  ) => Promise<ITProjectTicket[]>;
  findConfigsForTicket: () => Promise<ITTicketConfigs>;
  createProjectTicket: (form: any) => Promise<ITProjectTicket>;
  createTicketHistoryLogs: (
    form: ITTicketHistoryLogForm
  ) => Promise<ITProjectTicket>;
  updateStatusProjectTicket: (
    ticketId: number,
    status: string,
    form: object
  ) => Promise<ITProjectTicket>;
  updateProjectTicket: (
    ticketId: number,
    form: any
  ) => Promise<ITProjectTicket>;
  uploadFiles: (id: number, form: any) => Promise<any>;
  downloadFile: (id: number) => Promise<Blob>;
  deleteTicketFile: (id: number) => Promise<ITMaTaskFiles>;
  findProjectTicketTableByUserId: (
    userId: string,
    search: object,
    skip: number,
    take: number
  ) => Promise<{ data: ITProjectTicket[]; total: number }>;
  findExpenseType: () => Promise<ITExpenseType[]>;
  updateProjectTicketExpense: (
    expenseId: number,
    form: any
  ) => Promise<ITTicketExpense>;
  deleteProjectTicketExpense: (expenseId: number) => Promise<ITTicketExpense>;
}
const CrmServices = (axiosInstance: AxiosInstance): TMaServices => {
  const customerUrl = "/customer-detail";
  const customerProjectUrl = "/customer-project";
  const customerContactUrl = "/customer-contact";
  const projectTaskUrl = "/customer-project-task";
  const projectTicketUrl = "/customer-project-ticket";
  const ticketHistoryLogsUrl = "/ticket-history-logs";
  const filesUrl = "/customer-files";

  return {
    findContactlById: async (id) => {
      return await axiosInstance
        .get(`${customerContactUrl}/${id}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    },
    findProjectTicketByTaskId: async (taskId) => {
      return await axiosInstance
        .get(`${projectTicketUrl}/find-by-task/${taskId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    },
    findProjectTicketByProjectId: async (projectId) => {
      return await axiosInstance
        .get(`${projectTicketUrl}/find-by-project/${projectId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    },
    findProjectTicketDetailById: async (id) => {
      return await axiosInstance
        .get(`${projectTicketUrl}/detail/${id}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    },
    findConfigsForTicket: async () => {
      return await axiosInstance
        .get(`${customerUrl}/config/ticket-configs`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    },

    createProjectTicket: async (form) => {
      const formData = {
        ...form,
      };
      return await axiosInstance
        .post(`${projectTicketUrl}/`, formData)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return err;
        });
    },
    createTicketHistoryLogs: async (form) => {
      const formData = {
        ...form,
      };
      return await axiosInstance
        .post(`${ticketHistoryLogsUrl}/`, formData)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return err;
        });
    },
    updateStatusProjectTicket: async (ticketId, status, form) => {
      const formData = {
        ...form,
        status: status,
      };
      return await axiosInstance.patch(
        `${projectTicketUrl}/${ticketId}`,
        formData
      );
    },
    updateProjectTicket: async (ticketId, form) => {
      const formData = {
        ...form,
      };
      return await axiosInstance
        .patch(`${projectTicketUrl}/${ticketId}`, formData)
        .then((res) => res.data);
    },
    uploadFiles: async (id: number, form: any) => {
      return await axiosInstance
        .post(`${filesUrl}/${id}`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((result) => result.data)
        .catch((err) => err);
    },
    downloadFile: async (id: number) => {
      return await axiosInstance
        .get(`${filesUrl}/get-file/${id}`, { responseType: "blob" })
        .then((result) => {
          return result.data;
        })
        .catch((err) => console.log(err));
    },
    deleteTicketFile: async (id: number) => {
      return await axiosInstance.delete(`${filesUrl}/${id}`);
    },
    findProjectTicketTableByUserId: async (userId, search, skip, take) => {
      return await axiosInstance
        .get(`${projectTicketUrl}/data-table/${userId}`, {
          params: { query: search, skip: skip, take: take },
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return;
        });
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
