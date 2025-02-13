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
  ITSelectUsers,
  ITContractCompany,
  ITTicketExpense,
  ITExpenseType,
} from "../common";
import { ITMaTaskFiles } from "@/app/page/maintenance-management/common";
import { FormInstance } from "antd";
import { ITCustomerSub } from "../../ticket/common";
import { ITCustomerProduct } from "@/app/common/product";
import { ITCustomer } from "../../customer/common";
export interface TMaServices {
  findProjectDataTable: (
    search: object,
    take: number,
    skip: number,
    userId: string
  ) => Promise<{ data: ITProject[]; count: number }>;
  findCustomerActive: () => Promise<ITCustomerForSelect[]>;
  findCustomerSelectByCustomerGroupId: (
    customerGroupId: number
  ) => Promise<ITCustomerForSelect[]>;
  findCustomerSubSelectByCustomerId: (
    customerId: number
  ) => Promise<ITCustomerSub[]>;
  findBranchSelectByCustomerId: (
    customerId: number
  ) => Promise<ITCustomerDetailSubForSelect[]>;
  findBranchSelectByCustomerSubId: (
    customerSubId: number
  ) => Promise<ITCustomerDetailSubForSelect[]>;
  findProjectDetailById: (project: number) => Promise<ITProject>;
  findProjectTaskByProjectId: (project: number) => Promise<ITProjectTask[]>;

  findContactlById: (contactId: number) => Promise<ITCustomerDetailSubContact>;
  findProjectTicketByTaskId: (task: number) => Promise<ITProjectTicket[]>;
  findProjectTicketDetailById: (ticket: number) => Promise<ITProjectTicket>;
  findProjectTicketByProjectId: (
    projectId: number
  ) => Promise<ITProjectTicket[]>;
  findConfigsForTicket: () => Promise<ITTicketConfigs>;
  findContractCompany: () => Promise<ITContractCompany[]>;
  createProject: (form: ITProjectCreateForm) => Promise<ITProject>;
  createProjectTask: (
    projectId: number,
    form: ITProjectTaskForm
  ) => Promise<ITProjectTask>;
  createProjectTicket: (
    projectId: number,
    form: any
  ) => Promise<ITProjectTicket>;
  createTicketHistoryLogs: (
    form: ITTicketHistoryLogForm
  ) => Promise<ITProjectTicket>;
  updateStatusProjectTicket: (
    ticketId: number,
    status: string,
    form: object
  ) => Promise<ITProjectTicket>;
  updateProjectTask: (
    taskId: number,
    form: ITProjectTaskForm
  ) => Promise<ITProjectTaskForm>;
  updateProjectTicket: (
    ticketId: number,
    form: any
  ) => Promise<ITProjectTicket>;
  uploadFiles: (id: number, form: any) => Promise<any>;
  downloadFile: (id: number) => Promise<Blob>;
  deleteTicketFile: (id: number) => Promise<ITMaTaskFiles>;
  findExpenseType: () => Promise<ITExpenseType[]>;
  updateProjectTicketExpense: (
    expenseId: number,
    form: any
  ) => Promise<ITTicketExpense>;
  deleteProjectTicketExpense: (expenseId: number) => Promise<ITTicketExpense>;
}
const CrmServices = (axiosInstance: AxiosInstance): TMaServices => {
  const customerUrl = "/customer-detail";
  const customerBranchUrl = "/customer-branch";
  const customerProjectUrl = "/customer-project";
  const customerProductUrl = "/customer-product";
  const customerContactUrl = "/customer-contact";
  const projectTaskUrl = "/customer-project-task";
  const projectTicketUrl = "/customer-project-ticket";

  const ticketHistoryLogsUrl = "/ticket-history-logs";
  const filesUrl = "/customer-files";
  const customerSubUrl = "/customer-detail-sub";
  return {
    findCustomerActive: async () => {
      return await axiosInstance
        .get(`${customerUrl}/active-for-project`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findCustomerSelectByCustomerGroupId: async (customerGroup) => {
      return await axiosInstance
        .get(`${customerUrl}/list-by-customer-group/${customerGroup}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findCustomerSubSelectByCustomerId: async (customer) => {
      return await axiosInstance
        .get(`${customerSubUrl}/detail-list-by-customer/${customer}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findBranchSelectByCustomerId: async (customerId) => {
      return await axiosInstance
        .get(`${customerBranchUrl}/detail-list-by-customer/${customerId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findBranchSelectByCustomerSubId: async (customerSubId) => {
      return await axiosInstance
        .get(
          `${customerBranchUrl}/detail-list-by-customer-sub/${customerSubId}`
        )
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findProjectDataTable: async (search, take, skip, userId) => {
      return await axiosInstance
        .get(`${customerProjectUrl}/data-table?take=${take}&skip=${skip}`, {
          params: { ...search, userid: userId },
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findProjectDetailById: async (id) => {
      return await axiosInstance
        .get(`${customerProjectUrl}/detail/${id}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    },
    findProjectTaskByProjectId: async (projectId) => {
      return await axiosInstance
        .get(`${projectTaskUrl}/find-by-project/${projectId}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    },

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
    findContractCompany: async () => {
      return await axiosInstance
        .get(`${customerUrl}/contract-company`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    },

    createProject: async (form) => {
      return await axiosInstance.post(`${customerProjectUrl}/`, form);
    },
    createProjectTask: async (projectId, form) => {
      const formData = {
        ...form,
        customerProjectId: projectId,
      };
      return await axiosInstance.post(`${projectTaskUrl}/`, formData);
    },
    createProjectTicket: async (projectId, form) => {
      const formData = {
        ...form,
        customerProjectId: projectId,
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
    updateProjectTask: async (ticketId, form) => {
      return await axiosInstance.patch(`${projectTaskUrl}/${ticketId}`, form);
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
