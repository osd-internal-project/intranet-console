export type ITUserPermissionType = {
  id: number;
} & ITUserPermissionTypeForm;
export type ITUserPermissionTypeForm = {
  code: string;
  name: string;
  status: boolean;
  description?: string;
};
