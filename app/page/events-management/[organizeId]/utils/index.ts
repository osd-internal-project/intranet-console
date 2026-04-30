import type { UploadFile } from "antd";
import dayjs from "dayjs";

export const isParent = (record: any) => record && record.length > 0;

export const statusOptions = [
  { label: "Not started", value: "not_started" },
  { label: "In progress", value: "in_progress" },
  { label: "Done", value: "done" },
];

export const getStatusLabel = (status?: string) => {
  return statusOptions.find((s) => s.value === status)?.label || "-";
};

export const renderDate = (date?: string) => {
  return date ? dayjs(date).format("DD/MM/YYYY") : "-";
};

export type ITSelect = {
  label: string;
  value: string;
};

export type TaskNode = {
  id?: number;
  key: string;
  name: string;
  assigned?: string | null;
  assignedDate?: string;
  dueDate?: string;
  status?: string;
  remark?: string;
  pathFiles?: any;
  children?: TaskNode[];
  files?: UploadFile[];
  expenses?: number;
};
