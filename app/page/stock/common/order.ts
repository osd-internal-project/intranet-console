export type ITOrder = {
  id?: number;
  oderId?: string;
  prdId?: string;
  prdName?: string;
  price?: number;
  totalPrice?: number;
  totalQty?: number;
  unit?: string;
  expiredAt?: string | Date;
  updatedBy?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
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
  expiredAt?: Date | string;
  updatedBy: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type ITOrderUpdateInput = {
  oderId?: string;
  prdId?: string;
  prdName?: string;
  price?: number;
  totalPrice?: number;
  totalQty?: number;
  unit?: string;
  expiredAt?: Date | string;
  updatedBy?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type ITOrderLot = {
  id?: number;
  oderLotId?: string;
  prdId?: string;
  prdName?: string;
  price?: number;
  totalPrice?: number;
  totalQty?: number;
  unit?: string;
  barcode?: string;
  expiredAt?: Date | string;
  updatedBy?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type ITOrderLotCreateInput = {
  id?: number;
  oderLotId?: string;
  prdId: string;
  prdName: string;
  price?: number;
  totalPrice?: number;
  totalQty?: number;
  unit?: string;
  barcode?: string;
  expiredAt?: Date | string;
  updatedBy: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type ITOrderLotUpdateInput = {
  oderLotId?: string;
  prdId?: string;
  prdName?: string;
  price?: number;
  totalPrice?: number;
  totalQty?: number;
  unit?: string;
  barcode?: string;
  expiredAt?: Date | string;
  updatedBy?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};
