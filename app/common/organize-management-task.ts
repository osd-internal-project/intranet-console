export type organizeManagementTaskCreateInput = {
  id?: number;
  name: string;
  type?: string;
  date?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  createdBy?: string;
  updatedBy?: string;
  status?: string | null;
  organizeTasks?: organizeTaskCreateInput;
};

export type organizeTaskCreateInput = {
  id?: number;
  name: string;
  assigned: number;
  assignedDate?: Date | string;
  status?: string | null;
  pathFiles?: string | null;
  remark?: string | null;
  dueDate?: Date | string | null;
  expenses?: number | null;
};

export type organizeManagementConditons = {
  where: {
    name?: string;
    date?: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    createdBy?: string;
    updatedBy?: string;
    status?: string | null;
  };
  take: number;
  skip: number;
};
