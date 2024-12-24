export type ITMasterProductGroupForm = {
  name: string;
  createdAt: Date;
  updatedAt: Date;
};
export type ITMasterProductGroup = {
  id: number;
} & ITMasterProductGroupForm;
