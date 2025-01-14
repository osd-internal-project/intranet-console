export type ITMasterProductCategoryForm = {
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
export type ITMasterProductCategory = {
  id: number;
} & ITMasterProductCategoryForm;
