export interface typeVender {
  id: number;
  venderName: string;
  status: boolean;
  description: string;
  venderID: string;
  house_number: string;
  group: string;
  village: string;
  alley: string;
  road: string;
  sub_district: string;
  district: string;
  province: string;
  post_code: string;
  phoneNumber: string;
  fax_number: string;
  email: string;
  IDcard: string;
  createdAt: Date;
  updatedAt: Date;
  contact: typeContact[];
}

export interface typeVenderFilter {
  id: number;
  venderName: string;
  status: boolean;
  description: string;
  venderID: string;
  house_number: string;
  group: string;
  village: string;
  alley: string;
  road: string;
  sub_district: string;
  district: string;
  province: string;
  post_code: string;
  phoneNumber: string;
  fax_number: string;
  email: string;
  IDcard: string;
  createdAt: Date[];
  updatedAt: Date;
  contact: string[];
}

export interface typeContact {
  id: number;
  contactID: string;
  contact_name: string;
  phoneNumber: string;
  fax_number: string;
  email: string;
  description: string;
  venderID: string;
}
