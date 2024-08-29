export interface handbookFile {
  handbookid: Number;
  fileName: String;
  fileLocation: String;
  author: String;
  createdAt: String;
  updatedAt: String;
  filetype: String;
  status: boolean;
}
export interface handbook {
  idbook: Number;
  fileName: String;
  filetype: String;
  createdAt: String;
  updatedAt: String;
  author: String;
  status: boolean;
}
export interface handbooktype {
  idhandtype: Number;
  nameType: String;
  createdAt: String;
  updatedAt: String;
  status: boolean;
}
