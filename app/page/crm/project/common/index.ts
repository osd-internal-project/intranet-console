export type ITCustomerForSelect = {
  id: number;
  firstNameTh?: string;
  lastNameTh?: string;
  prefixTh?: string;
};
export type ITBranchForSelect = {
  id: number;
  branchName: string;
  customerAddress: ITBranchAddress[];
  customerContact: ITBranchContact[];
};
export type ITBranchAddressForm = {
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
export type ITBranchAddress = { id: number } & ITBranchAddressForm;
export type ITBranchContactForm = {
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
export type ITBranchContact = { id: number } & ITBranchContactForm;
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
//   customerBranch: { customerDetail: ITCustomerForSelect } & ITBranchForSelect;
// };

export type ITProjectCreateForm = {
  projectName: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  customerBranchId: number;
  taxAddressId?: number;
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
};
export type ITProject = {
  id: number;
  customerBranch: { customerDetail: ITCustomerForSelect } & ITBranchForSelect;
} & ITProjectCreateForm;
export type ITProjectTicketCreateForm = {
  ticketTitle: string;
  ticketDetail: string;
  customerProjectTaskId?: number;
  dueDate: Date;
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
  appointmentDate?: Date;
  reciveDate?: Date;
  finishDate?: Date;
  completeDate?: Date;
} & ITProjectTicketCreateForm &
  ITProjectTicketEditForm;
export type ITProjectTaskForm = {
  taskTitle: string;
  startDate: Date;
  endDate: Date;
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
export type ITConfigData = { id: number; name: string };
export type ITTicketConfigs = {
  channelTypeList: ITConfigData[];
  jobTypeList: ITConfigData[];
  priorityList: ITConfigData[];
  workTypeList: ITConfigData[];
  requestTypeList: ITConfigData[];
};
