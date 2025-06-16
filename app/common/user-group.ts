type ITUserGroup = {
  groupId: string;
  groupName: string;
  description: string;
  headId?: string;
  parentGroupId: string;
  userGroupMapPermission: ITUserGroupMapModule[];
};
type ITUserGroupMapModule = {
  id: number;
  leaveGroupId: string;
  leaveUserId: string;
  expenseGroupId: string;
  expenseUserId: string;
  permissionGroupId: string[];
  permissionUserId: string[];
  type?: string;
};
