export interface informationNews {
  newsId: Number;
  newsName: String;
  content: String;
  newsType: String;
  author: String;
  phblishedAt: String;
  updatedAt: String;
  status: boolean;
}
export interface newsType {
  idType: Number;
  nameType: String;
  deteil: String;
  updatedAt: string;
  createAt: String;
  status: boolean;
}
export interface newsImage {
  imageId: Number;
  newsId: Number;
  createdAt: String;
  updatedAt: String;
  fileimageName: String;
  fileimagePath: String;
}
