export interface MaCarType {
  id: number;
  carId: string;
  carName: string;
  carPetrol: string;
  carMile: number;
  detail: string;
  status: boolean;
  createdAt: Date;
  createdById: string;
  createdByName: string;
  updatedAt: Date;
  updatedById: string;
  updatedByName: string;
  maCarWrapup: MaCarWrapupType[];
  maCarBook: MaCarBookType[];
  maCarName: string;
  maStatus: boolean;
  maCarFiles: MaCarFile[];
  /** รูปรถ (profile/gallery) — มาพร้อมรถคันเดียวและรายการรถว่างตอนจอง */
  maCarImage?: MaCarImage[];

  fuelCardStatus?: "active" | "inactive";
  fuelCardNumber?: string;
  fuelCardExpiredDate?: Date;
  fuelMonthlyLimit?: number;
  fuelMonthlyRemaining?: number;
  fuelResetDayOfMonth?: number;

  // ทะเบียน/รายละเอียดรถ — carPetrol เก็บระดับน้ำมัน (high/medium/low) ส่วน fuelType คือชนิดเชื้อเพลิง (ดีเซล/เบนซิน)
  licensePlate?: string;
  carType?: string; // ประเภทรถ (dropdown จาก master maVehicleType) แยกจาก carCategory
  carCategory?: string; // ลักษณะ/ตัวถัง (free-text)
  brand?: string;
  model?: string;
  fuelType?: string;
  ownerName?: string;
  chassisNumber?: string;
  color?: string;
  modelYear?: string;
}

export interface MaCarFuelTransactionType {
  id: number;
  carId: string;
  date: Date;
  amount: number;
  remaining: number;
  description?: string;
  actionStatus: "use" | "adjust" | "reset";
}
export interface MaCarImage {
  id: number;
  carId: string;
  type: "profile" | "gallery";
  /** ชื่อไฟล์เดิม */
  name?: string;
  /** object key ใน MinIO */
  filePath: string;
  fileType?: string;
  createdAt: string;
}
export interface MaCarFile {
  id: number;
  /** ชื่อไฟล์เดิมที่ผู้ใช้เห็น */
  name?: string;
  /** uuid บน storage */
  fileName?: string;
  fileType?: string;
  /** object key ใน MinIO — ใช้ดึง/ดาวน์โหลด/ลบ */
  filePath?: string;
  createdAt: string;
  updatedAt?: string;
  carId?: string;
}

export interface MaCarBookType {
  id: number;
  carId: string;
  carName: string;
  carBookTitle: string;
  carBookProvince: string;
  carBookPlace: string;
  carBookUsers: number;
  carBookStartDate: Date;
  carBookEndDate: Date;
  carBookApprovedDate: Date;
  carBookApprovedById: string;
  carBookApprovedByName: string;
  carBookApprovedStatus: string;
  detail: string;
  remark: string;
  status: boolean;
  createdAt: Date;
  createdById: string;
  createdByName: string;
  updatedAt: Date;
  updatedById: string;
  updatedByName: string;
  recipientId: string;
  recipientName: string;
  returnNotifAt: Date;
  returnAt: Date;
  maCar: MaCarType;
  carSelected: string;
  idProvinces: string;
  remarkApproved: string;
  remarkCancel: string;
  fuelTransaction?: MaCarFuelTransactionType;
  // docs: dataMaCarbook[];
}

export interface MaCarBookFilter {
  carBookApprovedStatus?: string;
  carBookStartDate?: Date | string;
  createdByName?: string;
}

export interface dataMaCarbook {
  docs: MaCarBookType[];
  total: number;
}

export interface MaCarBookCalendarType {
  id: number;
  carId: string;
  carName: string;
  carPetrol: string;
  detail: string;
  carBookApprovedStatus: string;
  createdAt: Date;
  createdById: string;
  createdByName: string;
  updatedAt: Date;
  updatedById: string;
  updatedByName: string;
  carBookProvince: string;
  carBookPlace: string;
  carBookUsers: number;
  carBookStartDate: Date;
  carBookEndDate: Date;
  approveDate: string;
  carBookApprovedDate?: Date;
  carBookApprovedById?: string;
  carBookApprovedByName?: string;
  description: string;
  userName: string;
  recipientName: string;
  returnNotifAt?: Date;
  returnAt?: Date;
}

export interface MaCarWrapupType {
  status: null;
  id: number;
  carWrapupId: string;
  carId?: string;
  carName: string;
  typeId?: number;
  typeName: string;
  vender: string;
  cost: number;
  detail: string;
  objective?: string;
  wrapupMiles: string;
  dateStart: Date;
  dateEnd: Date;
  remark: string;
  createdAt: Date;
  updatedAt?: Date;
  createbyName?: string;
  maCar?: MaCarType[];
  maCarWrapupImage?: MaCarWrapupImage[];
}
export interface MaCarWrapupImage {
  idwarpupImage?: number;
  /** ชื่อไฟล์เดิมที่ผู้ใช้อัปโหลด (ใช้แสดงผล) */
  fileName?: string;
  /** object key ใน MinIO (uuid) — ใช้ดึง/ดาวน์โหลด/ลบไฟล์ */
  filePath?: string;
  fileType?: string;
  createdAt?: string;
  updatedAt?: string;
  carWrapupId?: string;
}

export interface ProvincesType {
  id: number;
  provinceId: string;
  nameProvinceTH: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type ITPagination = {
  current: number;
  pageSize: number;
  total?: number;
};

export interface MaCarType {
  id: number;
  typeName: string;
  detail: string;
  status: boolean;
  createdAt: Date;
  createdById: string;
  createdByName: string;
  remark?: string;
}

/* ---------- เอกสารรถยนต์: ประกัน / พ.ร.บ. / ภาษี ---------- */

/**
 * ประเภทเอกสารตามกฎหมาย
 * - insurance = ประกันภัย (มีบริษัท + ชั้นประกัน)
 * - act       = พ.ร.บ. (มีบริษัท ไม่มีชั้นประกัน)
 * - tax       = ภาษีรถยนต์ (จ่ายกับกรมการขนส่ง ไม่มีคู่สัญญา)
 */
export type DocType = "insurance" | "act" | "tax";

/** สถานะเอกสาร คำนวณจากวันหมดอายุเสมอ ไม่ได้เก็บใน DB */
export type DocStatusLevel = "expired" | "warning" | "ok" | "none";

export interface MaCarDocumentFile {
  id: number;
  name?: string;
  fileName?: string;
  fileType?: string;
  filePath?: string;
  createdAt: string;
  documentId?: string;
}

/** เอกสาร 1 งวดปี พร้อมสถานะที่ backend คำนวณมาให้แล้ว */
export interface MaCarDocumentType {
  documentId: string;
  docType: DocType;
  insuranceType: string | null;
  vender: string | null;
  policyNo: string | null;
  cost: number | null;
  startDate: string;
  expireDate: string;
  paidDate: string | null;
  remark: string | null;
  status: boolean;
  files: MaCarDocumentFile[];
  daysLeft: number | null;
  level: DocStatusLevel;
  // มีเฉพาะตอนดึงประวัติ (endpoint /history)
  createdAt?: string;
  createdByName?: string;
  updatedAt?: string;
  updatedByName?: string;
}

/** รถแบบย่อ ใช้เลี้ยง Select เลือกรถ + เปิด drawer — ไม่ต้องมีเอกสารครบ */
export interface CarLite {
  carId: string;
  carName: string;
  licensePlate: string | null;
}

/** 1 แถวของตาราง matrix = รถ 1 คัน + เอกสารปัจจุบันของทั้ง 3 ประเภท */
export interface CarDocMatrixRow {
  carId: string;
  carName: string;
  licensePlate: string | null;
  carType: string | null;
  carCategory: string | null;
  brand: string | null;
  model: string | null;
  fuelType: string | null;
  ownerName: string | null;
  insurance: MaCarDocumentType | null;
  act: MaCarDocumentType | null;
  tax: MaCarDocumentType | null;
  /** สถานะที่แย่ที่สุดของรถคันนี้ ใช้ระบายสีทั้งแถว */
  worstLevel: DocStatusLevel;
}

export interface DocSummary {
  year: number;
  expiredCount: number;
  /** ใกล้หมดอายุ <= 30 วัน */
  expiringSoonCount: number;
  /** ใกล้หมดอายุ <= 60 วัน (นับรวมช่วง <= 30 ด้วย) */
  expiringSoon60Count: number;
  missingCount: number;
  costThisYear: number;
  warningDays: number;
  slaSoonDays: number;
}

/**
 * ตัวกรองสถานะของตาราง matrix (ผูกกับการ์ดสรุป + Segmented)
 * warning = เอกสารปัจจุบันเหลือ <= 30 วัน, warning60 = <= 60 วัน (นับรวม <= 30)
 * แยกจาก DocStatusLevel เพราะ level cap ที่ warning(<=30) เอกสารที่เหลือ 45 วันเป็น level 'ok'
 */
export type MatrixStatusFilter =
  | "all"
  | "expired"
  | "warning"
  | "warning60"
  | "none";

/** เอกสาร 1 ใบที่ครบกำหนดในเดือนนั้น ใช้แสดงตอนคลิกช่องเดือนในปฏิทิน */
export interface DocDueItem {
  carId: string;
  carName: string;
  licensePlate: string | null;
  docType: DocType;
  expireDate: string;
  level: DocStatusLevel;
}

/** ช่อง 1 เดือนในปฏิทินครบกำหนด */
export interface DocDueMonth {
  year: number;
  month: number;
  insurance: number;
  act: number;
  tax: number;
  items: DocDueItem[];
}

export interface DocChartData {
  year: number;
  /** 13 เดือนนับจากเดือนปัจจุบัน จึงคาบเกี่ยวข้ามปีได้ ต้องใช้ year คู่กับ month เสมอ */
  upcoming: DocDueMonth[];
  budget: { month: number; amount: number }[];
}

/** ค่าที่เคยบันทึกไว้ ใช้เป็นตัวเลือกใน combobox ลดการพิมพ์ซ้ำ */
export interface DocSuggestions {
  vender: string[];
  insuranceType: string[];
}

/** 1 แถวในตาราง Log / Export — เอกสารแบบ flat รวมข้อมูลรถ (ทะเบียน/ชื่อ) ที่ join มา */
export interface DocLogRow extends MaCarDocumentType {
  carId: string;
  carName: string;
  licensePlate: string | null;
  createdAt: string;
  createdByName?: string;
  updatedByName?: string;
}

/** ตัวกรองของตาราง Log และ Export (startDate/endDate = ISO boundary ของช่วงเดือน) */
export interface DocLogFilters {
  carId?: string;
  docType?: DocType;
  startDate?: string;
  endDate?: string;
}

/** กลุ่มประเภทรถ (เช่น รถยนต์นั่ง / รถบรรทุก) — ชั้นแม่เหนือ ประเภทรถ */
export interface MaVehicleTypeGroup {
  id: number;
  groupName: string;
  detail?: string;
  status: boolean;
  createdAt: string | Date;
  createdById?: string;
  createdByName?: string;
}

/** master "ประเภทรถ" (รถ 4 ล้อ / 2 ล้อ ฯลฯ) — เลี้ยง dropdown ช่อง carType ในฟอร์มรถ */
export interface MaVehicleType {
  id: number;
  typeName: string;
  detail?: string;
  status: boolean;
  createdAt: string | Date;
  createdById?: string;
  createdByName?: string;
  //กลุ่มประเภทรถ (optional)
  maVehicleTypeGroupId?: number;
  maVehicleTypeGroup?: MaVehicleTypeGroup;
}
