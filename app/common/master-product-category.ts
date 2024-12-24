export type ITMasterProductCategoryForm = {
  name: string;
  createdAt: Date;
  updatedAt: Date;
};
export type ITMasterProductCategory = {
  id: number;
} & ITMasterProductCategoryForm;
