export type TdepartmentCreateDto = {
  departId: number;
  departName: string;
};

export type TdepartmentUpdateDto = TdepartmentCreateDto;

export type TdepartmentFindMany = {
  id: number;
  departId: number;
  departName: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};
