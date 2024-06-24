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
export type ITCustomerProject = {
  id: number;
  projectName: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  taxAddressText?: string;
  deliveryAddressText?: string;
  notiAddressText?: string;
  contactId?: string;
  customerBranch: { customerDetail: ITCustomerForSelect } & ITBranchForSelect;
};
export type ITProjectTicketCreateForm = {
  ticketTitle: string;
  ticketDetail: string;
  customerProjectTaskId?: number;
  dueDate: Date;
};
export type ITProjectTicket = {
  id: number;
  status: string;
} & ITProjectTicketCreateForm;
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
