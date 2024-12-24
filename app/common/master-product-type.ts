export type ITMasterProductType = {
  id: number;
} & ITMasterProductTypeForm;
export type ITMasterProductTypeForm = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};
