/**
 * แถวข้อมูลการผูก "กลุ่มผู้ใช้งาน" เข้ากับ "สิทธิ์การเข้าถึง" (ตาราง user_map_group_role)
 * roleCode คือ code ของสิทธิ์ใน app/config/user-roles.ts เช่น "admin", "ma-user"
 */
export type ITUserMapRoleGroup = {
  id: number;
  groupId: string;
  roleCode: string;
};
