export interface emailTemplate {
  id: number;
  name: String;
  formdoc: String;
  createAt: Date;
  updateAt: Date;
}

export type TEmailTemplate = {
  createAt: Date;
  emailTemplateFields: [];
  id: number;
  name: string;
  updateAt: Date;
};
