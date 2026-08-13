/**
 * กลุ่มผู้ใช้งาน (ตาราง user_group)
 * parentGroupId เป็น null เมื่อเป็นกลุ่มระดับบนสุด, organizedGroupId คือองค์กรที่กลุ่มนี้สังกัด
 */
export type ITUserGroup = {
  id: number;
  groupId: string;
  groupName: string;
  description: string;
  parentGroupId: string | null;
  organizedGroupId: string | null;
  createdAt: string;
  updatedAt: string;
};

/** ข้อมูลที่ส่งไปแก้ไขกลุ่ม — ตรงกับ body ที่ PATCH /user-group/:groupId รับจริง */
export type ITUserGroupUpdate = {
  groupName: string;
  description: string;
};

/** ข้อมูลที่ส่งไปสร้างกลุ่มย่อย — ตรงกับ body ที่ POST /user-group รับจริง */
export type ITUserGroupCreate = {
  groupName: string;
  description: string;
  parentGroupId: string;
  organizeId: string | null;
};

/** องค์กร (ตาราง organized) ใช้เป็นแท็บด้านซ้ายของหน้ากลุ่มผู้ใช้งาน */
export type ITOrganize = {
  id: number;
  organizedId: string;
  organizedName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

/** สมาชิกในกลุ่ม เท่าที่หน้ากลุ่มผู้ใช้งานใช้จริง */
export type ITUserGroupMember = {
  userId: string;
  firstNameTh: string;
  lastNameTh: string;
};
