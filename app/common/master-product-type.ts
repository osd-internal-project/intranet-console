export type ITMasterProductType = {
  id: number;
} & ITMasterProductTypeForm;
export type ITMasterProductTypeForm = {
  id: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
