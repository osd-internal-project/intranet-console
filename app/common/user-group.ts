type ITUserGroup = {
  groupId: string;
  groupName: string;
  description: string;
  headId?: string;
  parentGroupId: string;
  userGroupMapPermission: ITUserGroupMapPermissionType[];
};
type ITUserGroupMapPermissionType = {
  id: number;
  leaveGroupId: string;
  leaveUserId: string;
  expenseGroupId: string;
  expenseUserId: string;
  permissionGroupId: string[];
  permissionUserId: string[];
  type?: string;
};
