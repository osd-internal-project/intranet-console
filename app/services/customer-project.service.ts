import { AxiosInstance } from "axios";

import { ITMaTaskFiles } from "@/app/page/maintenance-management/common";
import { FormInstance } from "antd";
import {
  ITCustomerDetailSubContact,
  ITCustomer,
  ITCustomerSub,
  ITCustomerDetailSubDetail,
} from "@/app/common/customer";
import { ITCustomerProduct } from "@/app/common/product";
import {
  ITProject,
  ITCustomerForSelect,
  ITCustomerDetailSubForSelect,
  ITProjectTask,
  ITProjectTicket,
  ITTicketConfigs,
  ITContractCompany,
  ITProjectCreateForm,
  ITProjectTaskForm,
  ITTicketHistoryLogForm,
  ITExpenseType,
  ITTicketExpense,
} from "@/app/common/project";
export interface TMaServices {
  findProjectDataTable: (
    search: object,
    take: number,
    skip: number
  ) => Promise<{ data: ITProject[]; count: number }>;
  findCustomerActive: () => Promise<ITCustomerForSelect[]>;
  findCustomerSelectByCustomerGroupId: (
    customerGroupId: number
  ) => Promise<ITCustomerForSelect[]>;
  findCustomerSubSelectByCustomerId: (
    customerId: number
  ) => Promise<ITCustomerDetailSubDetail[]>;
  findCustomerSubSelectByCustomerSubId: (
    customerDetailSubId: number
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
  findProjectsByProductIdAndParentId: (
    productId: string,
    parentId: string,
    type: string,
    search: any
  ) => Promise<ITProject[]>;
  createProject: (
    form: ITProjectCreateForm,
    productDetails: any[]
  ) => Promise<ITProject>;
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
    findCustomerSubSelectByCustomerSubId: async (customerDetailSubId) => {
      return await axiosInstance
        .get(
          `${customerSubUrl}/detail-list-by-customer-sub/${customerDetailSubId}`
        )
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    findProjectDataTable: async (search, take, skip) => {
      return await axiosInstance
        .get(`${customerProjectUrl}/data-table?take=${take}&skip=${skip}`, {
          params: { ...search },
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
    findProjectsByProductIdAndParentId: async (
      productId,
      parentId,
      type,
      search
    ) => {
      return await axiosInstance
        .get(
          `${customerProjectUrl}/find-by-productid-and-parent?productid=${productId}&parentid=${parentId}&type=${type}`,
          { params: { search: search } }
        )
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    },
    createProject: async (data, productDetails) => {
      return await axiosInstance.post(`${customerProjectUrl}/`, {
        data: data,
        productDetails: productDetails,
      });
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
