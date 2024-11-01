export type ITCustomerProductForm = {
  name: string;
  activeStatus: boolean;
  description?: string;
  details?: any[];
  fields?: any[];
  createdAt: Date;
  updatedAt?: Date;
};
export type ITCustomerProduct = { id: string } & ITCustomerProductForm;
