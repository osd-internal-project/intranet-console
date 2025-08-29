export type ITypeOption = {
  label: number;
  value: string;
};

export type TCreateUserDto = {
  extension: string;
  userType: string;
  username: string;
  email: string;
  activeStatus: boolean;
  password: string;
  cfpassword: string;
  firstNameTh: string;
  lastNameTh: string;
  firstNameEn: string;
  lastNameEn: string;
  phoneNumber: string;
  masterPositionId: number;
  ldapQuery?: string;
  ownerGroupId?: string;
  startWork?: Date;
  empId?: string;
};
export type TUpdateUserDto = {
  id: number;
  userId: string;
} & TCreateUserDto;
export type TManageUserPageDto = {
  loading: boolean;
  pagination: {
    current: number;
    pageSize: number;
  };
  search: {};
  dataUsers: { data: TUserAllDto[]; total: number };
  modalStatus: boolean;
  modalTitle: "create" | "update";
};

export type TUserAllDto = {
  id: number;
  userId: string;
  userType: string | null;
  username: string;
  email: string;
  activeStatus: boolean;
  firstNameTh: string;
  lastNameTh: string;
  firstNameEn: string;
  lastNameEn: string;
  ldapQuery: string;
  phoneNumber: string;
  masterPosition?: TMasterPosition;
  imageId: string;
  userMapOrganizeChart: {
    id: number;
    positionId: string;
    userId: string;
  }[];
  ownerGroupId?: string;
  userMapOrganizeGroupOwner: TUserMapOrganizeGroupOwner[];
  dataModule: string[];
  positionId: number;
  departmentId: number;
  startWork?: Date;
};

export type TMasterPosition = {
  id: number;
  posId: number;
  nameTh: string;
  nameEn: string;
  createdAt: string;
  updatedAt: string;
};

export type TUserMapOrganizeGroupOwner = {
  id: number;
  usersId: string;
  organizedId: string;
  ownerGroupId: string;
};

export type TGroupId24 = {
  id: string;
  name: string;
  description: string;
  notes: "";
  createdAt: string;
  updatedAt: string;
  subGroups: TGroupId24[];
};

export type TOrganizeAllDto = {
  id: number;
  organizedId: string;
  organizedName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};
