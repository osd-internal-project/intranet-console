import { AxiosInstance } from "axios";
import {
  ITBranchForSelect,
  ITCustomerForSelect,
  ITBranchContact,
  ITProjectTaskForm,
  ITProjectTask,
  ITProjectTicket,
  ITProjectTicketEditForm,
  ITProjectCreateForm,
  ITProject,
} from "../common";
export interface TMaServices {
  findProjectDataTable: (
    search: object,
    take: number,
    skip: number
  ) => Promise<{ data: ITProject[]; count: number }>;
  findCustomerActive: () => Promise<ITCustomerForSelect[]>;
  findBranchByCustomerId: (customerId: number) => Promise<ITBranchForSelect[]>;
  findProjectDetailById: (project: number) => Promise<ITProject>;
  findProjectTaskByProjectId: (project: number) => Promise<ITProjectTask[]>;
  findContactlById: (contactId: number) => Promise<ITBranchContact>;
  findProjectTicketByTaskId: (task: number) => Promise<ITProjectTicket[]>;
  findProjectTicketDetailById: (ticket: number) => Promise<ITProjectTicket>;
  findProjectTicketByProjectId: (
    projectId: number
  ) => Promise<ITProjectTicket[]>;
  createProject: (form: ITProjectCreateForm) => Promise<ITProject>;
  createProjectTask: (
    projectId: number,
    form: ITProjectTaskForm
  ) => Promise<ITProjectTask>;
  createProjectTicket: (
    projectId: number,
    form: any
  ) => Promise<ITProjectTicket>;
  updateStatusProjectTicket: (
    ticketId: number,
    status: string
  ) => Promise<ITProjectTicket>;
  updateProjectTicket: (
    ticketId: number,
    form: ITProjectTicketEditForm
  ) => Promise<ITProjectTicket>;
}
const CrmServices = (axiosInstance: AxiosInstance): TMaServices => {
  const customerUrl = "/customer-detail";
  const customerBranchUrl = "/customer-branch";
  const customerProjectUrl = "/customer-project";
  const customerContactUrl = "/customer-contact";
  const projectTaskUrl = "/customer-project-task";
  const projectTicketUrl = "/customer-project-ticket";
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
    findBranchByCustomerId: async (customerId) => {
      const query = {
        customerDetailId: customerId,
      };
      return await axiosInstance
        .get(`${customerBranchUrl}/both-address-contact/${customerId}`, {})
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
          params: search,
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
      return await axiosInstance.post(`${projectTicketUrl}/`, formData);
    },
    updateStatusProjectTicket: async (ticketId, status) => {
      const formData = {
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
      return await axiosInstance.patch(
        `${projectTicketUrl}/${ticketId}`,
        formData
      );
    },
  };
};

export default CrmServices;
