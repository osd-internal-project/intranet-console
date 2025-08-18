export type ITOrder = {
  id?: number;
  oderId?: string;
  prdId?: string;
  prdName?: string;
  price?: number;
  totalPrice?: number;
  totalQty?: number;
  unit?: string;
  masterProductId?: string;
  updatedBy?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  orderLot?: ITOrderLot[];
  status?: string;
  approvedBy?: string;
  approvedAt?: Date | string;
  approvedDetail?: string;
};

export type ITOrderCreateInput = {
  id?: number;
  oderId?: string;
  prdId: string;
  prdName: string;
  price?: number;
  totalPrice?: number;
  totalQty?: number;
  unit?: string;
  status?: string;
  masterProductId?: string;
  updatedBy: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  approvedBy?: string;
  approvedAt?: Date | string;
};

export type ITOrderUpdateInput = {
  oderId?: string;
  prdId?: string;
  prdName?: string;
  price?: number;
  totalPrice?: number;
  totalQty?: number;
  unit?: string;
  status?: string;
  updatedBy?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  approvedBy?: string;
  approvedAt?: Date | string;
};

export type ITOrderLot = {
  id?: number;
  oderLotId?: string;
  prdId?: string;
  prdName?: string;
  price?: number;
  unit?: string;
  barcode?: string;
  expiredAt?: Date | string;
  updatedBy?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  status?: string;
};

export type ITOrderLotCreateInput = {
  id?: number;
  oderLotId?: string;
  prdId: string;
  prdName: string;
  price?: number;
  unit?: string;
  barcode?: string;
  status?: string;
  updatedBy: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type ITOrderLotUpdateInput = {
  oderLotId?: string;
  prdId?: string;
  prdName?: string;
  price?: number;
  unit?: string;
  barcode?: string;
  status?: string;
  updatedBy?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};
