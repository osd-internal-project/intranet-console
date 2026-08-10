// export type TUserRoles = {
//   //User Management
//   userManagementShow?: boolean;
//   usersShow?: boolean;
//   usersGroupShow?: boolean;
//   usersGroupAdd?: boolean;
//   usersGroupEdit?: boolean;
//   usersGroupDelete?: boolean;
//   userRoleShow?: boolean;
//   userRuleShow?: boolean;
//   userModuleShow?: boolean;
//   userGroupPermissionShow?: boolean;
//   //CRM
//   crmCustomerShow?: boolean;
//   crmCustomerAdd?: boolean;
//   crmCustomerEdit?: boolean;
//   crmCustomerDelete?: boolean;
//   crmProductShow?: boolean;
//   crmProductAdd?: boolean;
//   crmProductEdit?: boolean;
//   crmProductDelete?: boolean;
//   crmProjectShow?: boolean;
//   crmProjectAdd?: boolean;
//   crmProjectEdit?: boolean;
//   crmProjectDelete?: boolean;
//   crmTicketShow?: boolean;
//   crmTicketManageShow?: boolean;
//   crmTicketAdd?: boolean;
//   crmTicketEdit?: boolean;
//   crmTicketDelete?: boolean;
//   crmTicketSaleRequestFile?: boolean;
//   crmTicketEngieerUpdate?: boolean;
//   crmTicketHold?: boolean;
//   crmTicketComplete?: boolean;
//   //HR
//   //Intranet
//   //Intranet Leave
//   leaveShow?: boolean;
//   leaveUserDetailShow?: boolean;
//   leaveUserDetailAdd?: boolean;
//   leaveUserDetailEdit?: boolean;
//   leaveUserDetailDelete?: boolean;
//   leaveAdminDetailShow?: boolean;
//   leaveAdminDetailApprove?: boolean;
//   leaveAdminConfigShow?: boolean;
//   leaveAdminConfigAdd?: boolean;
//   leaveAdminConfigEdit?: boolean;
//   leaveAdminConfigDelete?: boolean;
//   //Intranet Booking Room
//   bookingRoomShow?: boolean;
//   bookingRoomDetailShow?: boolean;
//   bookingRoomDetailAdd?: boolean;
//   bookingRoomDetailEdit?: boolean;
//   bookingRoomDetailDelete?: boolean;
//   bookingRoomAdminDetailShow?: boolean;
//   bookingRoomAdminConfigShow?: boolean;
//   bookingRoomAdminConfigAdd?: boolean;
//   bookingRoomAdminConfigEdit?: boolean;
//   bookingRoomAdminConfigDelete?: boolean;
//   //Intranet Ma Building
//   maBuildingShow?: boolean;
//   maBuildingUserDetailShow?: boolean;
//   maBuildingUserDetailAdd?: boolean;
//   maBuildingUserDetailEdit?: boolean;
//   maBuildingUserDetailDelete?: boolean;
//   maBuildingAdminConfigShow?: boolean;
//   maBuildingAdminConfigAdd?: boolean;
//   maBuildingAdminConfigEdit?: boolean;
//   maBuildingAdminConfigDelete?: boolean;
//   //Intranet Ma Car
//   maCarShow?: boolean;
//   maCarUserDetailShow?: boolean;
//   maCarUserDetailAdd?: boolean;
//   maCarUserDetailEdit?: boolean;
//   maCarUserDetailDelete?: boolean;
//   maCarAdminDetailShow?: boolean;
//   maCarAdminDetailApprove?: boolean;
//   maCarAdminConfigShow?: boolean;
//   maCarAdminConfigAdd?: boolean;
//   maCarAdminConfigEdit?: boolean;
//   maCarAdminConfigDelete?: boolean;
// };

// export enum UserRoles {
//   //User Management
//   userManagementShow = "um-s",
//   usersShow = "um-u-s",
//   usersGroupShow = "um-ug-s",
//   usersGroupAdd = "um-ug-a",
//   usersGroupEdit = "um-ug-e",
//   usersGroupDelete = "um-ug-d",
//   userRoleShow = "um-ro-s",
//   userRuleShow = "um-ru-s",
//   userModuleShow = "um-m-s",
//   userGroupPermissionShow = "um-up-s",
//   //CRM
//   crmShow = "crm-s",
//   crmCustomerShow = "crm-c-s",
//   crmCustomerAdd = "crm-c-a",
//   crmCustomerEdit = "crm-c-e",
//   crmCustomerDelete = "crm-c-d",
//   crmProductShow = "crm-pd-s",
//   crmProductAdd = "crm-pd-a",
//   crmProductEdit = "crm-pd-e",
//   crmProductDelete = "crm-pd-d",
//   crmProjectShow = "crm-pj-s",
//   crmProjectAdd = "crm-pj-a",
//   crmProjectEdit = "crm-pj-e",
//   crmProjectDelete = "crm-pj-d",
//   crmTicketShow = "crm-t-s",
//   crmTicketManageShow = "crm-tm-s",
//   crmTicketAdd = "crm-t-a",
//   crmTicketEdit = "crm-t-e",
//   crmTicketDelete = "crm-t-d",
//   crmTicketSaleRequestFile = "crm-t-srf",
//   crmTicketEngieerUpdate = "crm-t-eu",
//   crmTicketHold = "crm-t-h",
//   crmTicketComplete = "crm-t-cp",
//   crmTicketClose = "crm-t-c",
//   //HR
//   //Intranet
//   //Intranet Leave
//   leaveShow = "il-s",
//   leaveUserDetailShow = "il-ud-s",
//   leaveUserDetailAdd = "il-ud-a",
//   leaveUserDetailEdit = "il-ud-e",
//   leaveUserDetailDelete = "il-ud-d",
//   leaveAdminDetailShow = "il-ad-s",
//   leaveAdminDetailApprove = "il-ad-ap",
//   leaveAdminConfigShow = "il-ac-s",
//   leaveAdminConfigAdd = "il-ac-a",
//   leaveAdminConfigEdit = "il-ac-e",
//   leaveAdminConfigDelete = "il-ac-d",
//   //Intranet Booking Room
//   bookingRoomShow = "ibr-s",
//   bookingRoomDetailShow = "ibr-d-s",
//   bookingRoomDetailAdd = "ibr-d-a",
//   bookingRoomDetailEdit = "ibr-d-e",
//   bookingRoomDetailDelete = "ibr-d-d",
//   bookingRoomAdminDetailShow = "ibr-ad-s",
//   bookingRoomAdminConfigShow = "ibr-ac-s",
//   bookingRoomAdminConfigAdd = "ibr-ac-a",
//   bookingRoomAdminConfigEdit = "ibr-ac-e",
//   bookingRoomAdminConfigDelete = "ibr-ac-d",
//   //Intranet Ma Building
//   maBuildingShow = "imab-s",
//   maBuildingUserDetailShow = "imab-ud-s",
//   maBuildingUserDetailAdd = "imab-ud-a",
//   maBuildingUserDetailEdit = "imab-ud-e",
//   maBuildingUserDetailDelete = "imab-ud-d",
//   maBuildingAdminConfigShow = "imab-ac-s",
//   maBuildingAdminConfigAdd = "imab-ac-a",
//   maBuildingAdminConfigEdit = "imab-ac-e",
//   maBuildingAdminConfigDelete = "imab-ac-d",
//   //Intranet Ma Car
//   maCarShow = "imac-s",
//   maCarUserDetailShow = "imac-ud-s",
//   maCarUserDetailAdd = "imac-ud-a",
//   maCarUserDetailEdit = "imac-ud-e",
//   maCarUserDetailDelete = "imac-ud-d",
//   maCarAdminDetailShow = "imac-ad-s",
//   maCarAdminDetailApprove = "imac-ad-ap",
//   maCarAdminConfigShow = "imac-ac-s",
//   maCarAdminConfigAdd = "imac-ac-a",
//   maCarAdminConfigEdit = "imac-ac-e",
//   maCarAdminConfigDelete = "imac-ac-d",
// }
/**
 * นิยามของสิทธิ์ 1 รายการ
 * - code: ค่าที่อยู่ใน token ของ ID24 (ใช้เทียบสิทธิ์จริง)
 * - name: ชื่อที่แสดงให้ผู้ใช้เห็น
 * - description: คำอธิบายขอบเขตของสิทธิ์
 */
export interface RoleDefinition {
  readonly code: string;
  readonly name: string;
  readonly description: string;
}

/**
 * ศูนย์กลางของสิทธิ์ทั้งหมดในระบบ (single source of truth)
 * เพิ่ม/แก้สิทธิ์ที่นี่ที่เดียว แล้วเมนู (menu.tsx), ปุ่มต่าง ๆ (accessRole)
 * และหน้า Roles จะอัปเดตตามทันที
 */
export const ROLES = {
  user: {
    code: "user",
    name: "ผู้ใช้งานทั่วไป",
    description: "ใช้งานระบบทั่วไป เช่น ยื่นใบลา จองรถ และจองห้องประชุม",
  },

  header: {
    code: "header",
    name: "หัวหน้างาน",
    description: "อนุมัติและตรวจสอบรายการลาและการทำงานล่วงเวลาของทีม",
  },
  hr: {
    code: "hr",
    name: "ฝ่ายบุคคล",
    description: "จัดการข้อมูลพนักงาน การลา และการตั้งค่าที่เกี่ยวข้องกับบุคคล",
  },
  maUser: {
    code: "ma-user",
    name: "ฝ่ายซ่อมบำรุง",
    description: "จัดการงานบำรุงรักษาทรัพย์สินและข้อมูลรถยนต์",
  },
  account: {
    code: "account",
    name: "ฝ่ายบัญชี",
    description: "ดูรายงานและข้อมูลค่าใช้จ่ายของระบบรถ",
  },
  admin: {
    code: "admin",
    name: "ผู้ดูแลระบบ",
    description: "เข้าถึงสิทธิ์การจัดการทั้งหมดของระบบ",
  },
} as const satisfies Record<string, RoleDefinition>;

/** ชื่อคีย์ของสิทธิ์ เช่น "admin" | "maUser" (ใช้กับ accessRole) */
export type RoleKey = keyof typeof ROLES;

/** ค่า code ของสิทธิ์ เช่น "admin" | "ma-user" (ใช้กับเมนูและ token) */
export type RoleCode = (typeof ROLES)[RoleKey]["code"];

/** รายการสิทธิ์ทั้งหมดในรูปแบบ array — ใช้แสดงตารางในหน้า Roles */
export const ROLE_LIST: readonly RoleDefinition[] = Object.values(ROLES);

/**
 * ตรวจว่าสิทธิ์ของผู้ใช้ตรงกับสิทธิ์ที่ยอมรับได้อย่างน้อยหนึ่งอย่างหรือไม่
 * @param userRoleCodes รายการ code สิทธิ์ของผู้ใช้ที่ได้จาก token
 * @param allowed สิทธิ์ที่ยอมรับได้ (code เดียวหรือหลาย code)
 * @returns true เมื่อผู้ใช้มีสิทธิ์ใดสิทธิ์หนึ่งในรายการ
 */
export const hasRoleCode = (
  userRoleCodes: string[],
  allowed: RoleCode | RoleCode[],
): boolean =>
  (Array.isArray(allowed) ? allowed : [allowed]).some((code) =>
    userRoleCodes.includes(code),
  );

/** แผนที่สิทธิ์ของผู้ใช้ในรูปแบบ { admin: true, hr: true } */
export type TUserRoles = Partial<Record<RoleKey, boolean>>;

/**
 * @deprecated ใช้ ROLES แทน — คงไว้เพื่อ backward compatibility ของโค้ดเดิม
 * รูปแบบ { admin: "admin", maUser: "ma-user", ... }
 */
export const UserRoles: { [K in RoleKey]: (typeof ROLES)[K]["code"] } =
  Object.fromEntries(
    Object.entries(ROLES).map(([key, role]) => [key, role.code]),
  ) as { [K in RoleKey]: (typeof ROLES)[K]["code"] };
