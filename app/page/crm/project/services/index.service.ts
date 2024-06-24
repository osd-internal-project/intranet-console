import { AxiosInstance } from "axios";
import {
  ITBranchForSelect,
  ITCustomerForSelect,
  ITCustomerProject,
  ITBranchContact,
  ITProjectTaskForm,
  ITProjectTask,
  ITProjectTicket,
} from "../common";
export interface TMaServices {
  findProjectDataTable: (
    search: object,
    take: number,
    skip: number
  ) => Promise<{ data: ITCustomerProject[]; count: number }>;
  findCustomerActive: () => Promise<ITCustomerForSelect[]>;
  findBranchByCustomerId: (customerId: number) => Promise<ITBranchForSelect[]>;
  findProjectDetailById: (project: number) => Promise<ITCustomerProject>;
  findProjectTaskByProjectId: (project: number) => Promise<ITProjectTask[]>;
  findContactlById: (contactId: number) => Promise<ITBranchContact>;
  findProjectTicketByTaskId: (task: number) => Promise<ITProjectTicket[]>;
  createProject: (form: ITCustomerForSelect) => Promise<ITCustomerForSelect[]>;
  createProjectTask: (
    projectId: number,
    form: ITProjectTaskForm
  ) => Promise<ITProjectTask>;
  createProjectTicket: (
    projectId: number,
    form: any
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
  };
};

export default CrmServices;
