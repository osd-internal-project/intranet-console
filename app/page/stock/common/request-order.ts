import { Dayjs } from "dayjs";
import { ITMasterProduct } from "./master-product";

export type ITRequestOrder = {
  approvedDetail: string;
  id?: number;
  requestId?: string;
  requestPrice?: number;
  requestQty?: number;
  requester?: string;
  requestDate?: Date | string | Dayjs | null;
  object?: string;
  status?: "new" | "approved" | "rejected" | "cancelled";
  remark?: string;
  createdBy?: string;
  createdAt?: Date | string | Dayjs | null;
  updatedAt?: Date | string | Dayjs | null;
  requestList?: ITRequestOrderList[];
  action?: "new" | "approved" | "rejected" | "cancelled";
};

export type ITRequestOrderList = {
  id?: number;
  requestId?: string;
  masterProductId?: string;
  qty?: number;
  amount?: number;
  masterProduct?: ITMasterProduct[];
};

export type ITCreateRequestOrderInput = {
  requestPrice?: number;
  requestQty?: number;
  status?: string;
  remark?: string;
  createdBy?: string;
  createdAt?: Date | string | Dayjs | null;
  updatedAt?: Date | string | Dayjs | null;
};
