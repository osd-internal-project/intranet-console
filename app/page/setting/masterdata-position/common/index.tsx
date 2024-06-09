export interface TCreatePositionDto {
  nameTh: string;
  nameEn: string;
  departMentId: number;
}
export interface ITypeGetdataAll {
  id: number;
  nameTh?: string;
  nameEn: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FieldTypeUnit {
  nameTh?: string;
  nameEn?: string;
  status?: string;
  updatedAt?: string;
  id?: number;
}
