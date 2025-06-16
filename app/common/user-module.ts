export type ITUserModule = {
  id: number;
} & ITUserModuleForm;
export type ITUserModuleForm = {
  code: string;
  name: string;
  status: boolean;
  description?: string;
};
