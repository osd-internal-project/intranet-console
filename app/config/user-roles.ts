export type TUserRoles = {
  //User Management
  userManagementShow?: boolean;
  usersShow?: boolean;
  usersGroupShow?: boolean;
  usersGroupAdd?: boolean;
  usersGroupEdit?: boolean;
  usersGroupDelete?: boolean;
  userRoleShow?: boolean;
  userRuleShow?: boolean;
  userModuleShow?: boolean;
  userGroupPermissionShow?: boolean;
  //CRM
  crmCustomerShow?: boolean;
  crmCustomerAdd?: boolean;
  crmCustomerEdit?: boolean;
  crmCustomerDelete?: boolean;
  crmProductShow?: boolean;
  crmProductAdd?: boolean;
  crmProductEdit?: boolean;
  crmProductDelete?: boolean;
  crmProjectShow?: boolean;
  crmProjectAdd?: boolean;
  crmProjectEdit?: boolean;
  crmProjectDelete?: boolean;
  crmTicketShow?: boolean;
  crmTicketAdd?: boolean;
  crmTicketEdit?: boolean;
  crmTicketDelete?: boolean;
  crmTicketSaleRequestFile?: boolean;
  crmTicketEngieerUpdate?: boolean;
  crmTicketHold?: boolean;
  crmTicketComplete?:boolean;
  //HR
  //Intranet
  //Intranet Leave
  leaveShow?: boolean;
  leaveUserDetailShow?: boolean;
  leaveUserDetailAdd?: boolean;
  leaveUserDetailEdit?: boolean;
  leaveUserDetailDelete?: boolean;
  leaveAdminDetailShow?: boolean;
  leaveAdminDetailApprove?: boolean;
  leaveAdminConfigShow?: boolean;
  leaveAdminConfigAdd?: boolean;
  leaveAdminConfigEdit?: boolean;
  leaveAdminConfigDelete?: boolean;
  //Intranet Booking Room
  bookingRoomShow?: boolean;
  bookingRoomDetailShow?: boolean;
  bookingRoomDetailAdd?: boolean;
  bookingRoomDetailEdit?: boolean;
  bookingRoomDetailDelete?: boolean;
  bookingRoomAdminDetailShow?: boolean;
  bookingRoomAdminConfigShow?: boolean;
  bookingRoomAdminConfigAdd?: boolean;
  bookingRoomAdminConfigEdit?: boolean;
  bookingRoomAdminConfigDelete?: boolean;
  //Intranet Ma Building
  maBuildingShow?: boolean;
  maBuildingUserDetailShow?: boolean;
  maBuildingUserDetailAdd?: boolean;
  maBuildingUserDetailEdit?: boolean;
  maBuildingUserDetailDelete?: boolean;
  maBuildingAdminConfigShow?: boolean;
  maBuildingAdminConfigAdd?: boolean;
  maBuildingAdminConfigEdit?: boolean;
  maBuildingAdminConfigDelete?: boolean;
  //Intranet Ma Car
  maCarShow?: boolean;
  maCarUserDetailShow?: boolean;
  maCarUserDetailAdd?: boolean;
  maCarUserDetailEdit?: boolean;
  maCarUserDetailDelete?: boolean;
  maCarAdminDetailShow?: boolean;
  maCarAdminDetailApprove?: boolean;
  maCarAdminConfigShow?: boolean;
  maCarAdminConfigAdd?: boolean;
  maCarAdminConfigEdit?: boolean;
  maCarAdminConfigDelete?: boolean;
};

export enum UserRoles {
  //User Management
  userManagementShow = "um-s",
  usersShow = "um-u-s",
  usersGroupShow = "um-ug-s",
  usersGroupAdd = "um-ug-a",
  usersGroupEdit = "um-ug-e",
  usersGroupDelete = "um-ug-d",
  userRoleShow = "um-ro-s",
  userRuleShow = "um-ru-s",
  userModuleShow = "um-m-s",
  userGroupPermissionShow = "um-up-s",
  //CRM
  crmShow = "crm-s",
  crmCustomerShow = "crm-c-s",
  crmCustomerAdd = "crm-c-a",
  crmCustomerEdit = "crm-c-e",
  crmCustomerDelete = "crm-c-d",
  crmProductShow = "crm-pd-s",
  crmProductAdd = "crm-pd-a",
  crmProductEdit = "crm-pd-e",
  crmProductDelete = "crm-pd-d",
  crmProjectShow = "crm-pj-s",
  crmProjectAdd = "crm-pj-a",
  crmProjectEdit = "crm-pj-e",
  crmProjectDelete = "crm-pj-d",
  crmTicketShow = "crm-t-s",
  crmTicketAdd = "crm-t-a",
  crmTicketEdit = "crm-t-e",
  crmTicketDelete = "crm-t-d",
  crmTicketSaleRequestFile = "crm-t-srf",
  crmTicketEngieerUpdate = "crm-t-eu",
  crmTicketHold= "crm-t-h",
  crmTicketComplete='crm-t-cp',
  crmTicketClose='crm-t-c',
  //HR
  //Intranet
  //Intranet Leave
  leaveShow = "il-s",
  leaveUserDetailShow = "il-ud-s",
  leaveUserDetailAdd = "il-ud-a",
  leaveUserDetailEdit = "il-ud-e",
  leaveUserDetailDelete = "il-ud-d",
  leaveAdminDetailShow = "il-ad-s",
  leaveAdminDetailApprove = "il-ad-ap",
  leaveAdminConfigShow = "il-ac-s",
  leaveAdminConfigAdd = "il-ac-a",
  leaveAdminConfigEdit = "il-ac-e",
  leaveAdminConfigDelete = "il-ac-d",
  //Intranet Booking Room
  bookingRoomShow = "ibr-s",
  bookingRoomDetailShow = "ibr-d-s",
  bookingRoomDetailAdd = "ibr-d-a",
  bookingRoomDetailEdit = "ibr-d-e",
  bookingRoomDetailDelete = "ibr-d-d",
  bookingRoomAdminDetailShow = "ibr-ad-s",
  bookingRoomAdminConfigShow = "ibr-ac-s",
  bookingRoomAdminConfigAdd = "ibr-ac-a",
  bookingRoomAdminConfigEdit = "ibr-ac-e",
  bookingRoomAdminConfigDelete = "ibr-ac-d",
  //Intranet Ma Building
  maBuildingShow = "imab-s",
  maBuildingUserDetailShow = "imab-ud-s",
  maBuildingUserDetailAdd = "imab-ud-a",
  maBuildingUserDetailEdit = "imab-ud-e",
  maBuildingUserDetailDelete = "imab-ud-d",
  maBuildingAdminConfigShow = "imab-ac-s",
  maBuildingAdminConfigAdd = "imab-ac-a",
  maBuildingAdminConfigEdit = "imab-ac-e",
  maBuildingAdminConfigDelete = "imab-ac-d",
  //Intranet Ma Car
  maCarShow = "imac-s",
  maCarUserDetailShow = "imac-ud-s",
  maCarUserDetailAdd = "imac-ud-a",
  maCarUserDetailEdit = "imac-ud-e",
  maCarUserDetailDelete = "imac-ud-d",
  maCarAdminDetailShow = "imac-ad-s",
  maCarAdminDetailApprove = "imac-ad-ap",
  maCarAdminConfigShow = "imac-ac-s",
  maCarAdminConfigAdd = "imac-ac-a",
  maCarAdminConfigEdit = "imac-ac-e",
  maCarAdminConfigDelete = "imac-ac-d",
}
