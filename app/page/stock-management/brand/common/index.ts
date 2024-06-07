export interface ITypeCreateBrands {
  name: string;
  status: boolean;
}

export interface ITypeCreateBodyBrands {
  data: {
    name: string;
    status: boolean;
  };
}

export interface ITypeGetdataAll {
  id: number;
  name: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FieldType {
  name?: string;
  status?: string;
  updatedAt?: string;
  id?: number;
}
