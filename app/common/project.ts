import { ITCustomerSub } from "./customer";

export type ITCustomerForSelect = {
  id: number;
  customerTypeId: string;
  details?: {
    prefixEn?: string;
    prefixTh?: string;
    firstNameEn?: string;
    firstNameTh?: string;
    lastNameEn?: string;
    lastNameTh?: string;
    customerNameTh?: string;
    customerNameEn?: string;
  };
  firstNameTh?: string;
  lastNameTh?: string;
  prefixTh?: string;
  responsible: { uid: string; name: string }[];
};
export interface ITCustomerFile {
  id: number;
  fileCode: string;
  fileName: string;
}
export type ITCustomerDetailSubForSelect = {
  id: number;
  name: string;
  customerAddress: ITCustomerDetailSubAddress[];
  customerContact: ITCustomerDetailSubContact[];
};
export type ITCustomerDetailSubAddressForm = {
  addressTypeId: string;
  addressTypeName: string;
  alley: string;
  building: string;
  district: string;
  floor: string;
  houseNumber: string;
  province: string;
  road: string;
  roomNumber: string;
  subDistrict: string;
  village: string;
  zipCode: string;
};
export type ITCustomerDetailSubAddress = { id: number } & ITCustomerDetailSubAddressForm;
export type ITCustomerDetailSubContactForm = {
  name: string;
  nickName: string;
  position: string;
  phone: string;
  officePhone: string;
  fax: string;
  email: string;
  birthday: Date;
  activeStatus: boolean;
};
export type ITCustomerDetailSubContact = { id: number } & ITCustomerDetailSubContactForm;
// export type ITCustomerProject = {
//   id: number;
//   projectName: string;
//   startDate: Date;
//   endDate: Date;
//   duration: number;
//   taxAddressText?: string;
//   deliveryAddressText?: string;
//   notiAddressText?: string;
//   contactId?: string;
//   customerSub: { customerDetail: ITCustomerForSelect } & ITCustomerDetailSubForSelect;
// };

export type ITProjectCreateForm = {
  customerId?: string;
  projectName: string;
  productName?: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  customerSubId: number;
  taxAddressId?: number;
  customerDetailSubId?: number;
  taxAddressText?: string;
  deliveryAddressId?: number;
  deliveryAddressText?: string;
  notiAddressId?: number;
  notiAddressText?: string;
  contactId?: number;
  projectManagerId?: string;
  projectManagerName?: string;
  saleManagerId?: string;
  saleManagerName?: string;
  saleId?: string;
  saleName?: string;
  description?: string;
  productDetails: any[];
};
export type ITProject = {
  id: number;
  customerDetailSub: {
    customerDetail: ITCustomerForSelect; 
  } & ITCustomerDetailSubForSelect;
  contractCompany?: { id: number; name: string };
} & ITProjectCreateForm;
export type ITProjectTicketCreateForm = {
  ticketTitle: string;
  ticketDetail: string;
  customerProjectTaskId?: number;
  dueDate: Date;
  appointmentDate: Date;
  requestDate: Date;
  requestTypeId?: number;
  requestTypeName?: string;
  jobTypeId?: number;
  jobTypeName?: string;
  workTypeId?: number;
  workTypeName?: string;
  channelTypeId?: number;
  channelTypeName?: string;
  priorityId?: number;
  priorityName?: string;
  assignId: string;
  assignName: string;
};
export type ITProjectTicketEditForm = {
  problem?: string;
  solution?: string;
  result?: string;
};
export type ITProjectTicket = {
  id: number;
  status: string;
  createdAt?: Date;
  ticketExpense: ITTicketExpense[];
  receiveDate?: Date;
  finishDate?: Date;
  completeDate?: Date;
  ticketHistoryLogs?: ITTicketHistoryLog[];
  summary?: string;
  manhour?: number;
  createFiles?: ITCustomerFile[];
  updateFiles?: ITCustomerFile[];
} & ITProjectTicketCreateForm &
  ITProjectTicketEditForm;
export type ITProjectTaskForm = {
  taskTitle: string;
  startDate: Date;
  endDate: Date;
  weight: number;
  customerProjectId: number;
};
export type ITProjectTask = {
  id: number;
  customerProjectTicket?: ITProjectTicket[];
} & ITProjectTaskForm;
export type ITSelectUsers = {
  userId: string;
  firstNameTh: string;
  lastNameTh: string;
};
export type ITContractCompany = { id: number; name: string };
export type ITConfigData = { id: number; name: string };
export type ITTicketConfigs = {
  channelTypeList: ITConfigData[];
  jobTypeList: ITConfigData[];
  priorityList: ITConfigData[];
  workTypeList: ITConfigData[];
  requestTypeList: {
    id: number;
    name: string;
    customerJobType: ITConfigData[];
  }[];
};
export type ITTicketHistoryLogForm = {
  type: string;
  updatedById: string;
  updatedByName: string;
  updatedAt: Date;
  detail: string;
  customerProjectTicketId: number;
};
export type ITTicketHistoryLog = {
  id: number;
} & ITTicketHistoryLogForm;
export type ITTicketExpense = {
  id?: number;
  processStatus: string;
  expenseAmount: number;
  expensePrice: number;
  expenseType?: { expenseCode: string; expenseName: string };
  createdAt: Date;
  updatedAt: Date;
  updatedById?: string;
  updatedByName?: string;
};
export type ITExpenseType = {
  expenseCode: string;
  expenseName: string;
};
