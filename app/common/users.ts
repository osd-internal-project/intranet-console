type ITUser = {
  userId: string;
  username: string;
  firstNameTh?: string;
  lastNameTh?: string;
  firstNameEn?: string;
  lastNameEn?: string;
  email?: string;
  phoneNumber: string;
  activeStatus: boolean;
  createdAt: Date;
  updatedAt: Date;
  password: string;
  masterPositionId?: number;
  masterPosition?: { nameTh?: string; nameEn?: string };
};
