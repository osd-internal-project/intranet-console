export interface addUnit {
  name: string;
}
export interface ITypeGetdataAll {
  id: number;
  unitID: string;
  unitName: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FieldTypeUnit {
  unitName?: string;
  status?: string;
  updatedAt?: string;
  id?: number;
}
