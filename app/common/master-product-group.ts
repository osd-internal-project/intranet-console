export type ITMasterProductGroupForm = {
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
export type ITMasterProductGroup = {
  id: number;
} & ITMasterProductGroupForm;
