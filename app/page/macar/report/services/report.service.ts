import { AxiosInstance } from "axios";

/** หมวดค่าใช้จ่ายของฟลีต — ต้องตรงกับ CostCategory ฝั่ง backend */
export type CostCategory = "fuel" | "maintenance" | "insurance" | "act" | "tax";

/** ป้ายภาษาไทยของหมวดค่าใช้จ่าย (ใช้ร่วมกันทุกกราฟ/ตาราง/Excel) */
export const CATEGORY_LABEL: Record<CostCategory, string> = {
  fuel: "ค่าน้ำมัน",
  maintenance: "ค่าบำรุงรักษา",
  insurance: "ค่าประกันภัย",
  act: "ค่า พ.ร.บ.",
  tax: "ค่าภาษี",
};

/** สีประจำหมวด — คงที่ทุกกราฟเพื่อให้อ่านข้ามกราฟได้ */
export const CATEGORY_COLOR: Record<CostCategory, string> = {
  fuel: "#faad14",
  maintenance: "#722ed1",
  insurance: "#1677ff",
  act: "#13c2c2",
  tax: "#52c41a",
};

/** ลำดับการแสดงหมวด (ใช้ใน stacked bar และ donut) */
export const CATEGORY_ORDER: CostCategory[] = [
  "fuel",
  "maintenance",
  "insurance",
  "act",
  "tax",
];

/** ป้ายภาษาไทยของประเภทเอกสาร */
export const DOC_TYPE_LABEL: Record<string, string> = {
  insurance: "ประกันภัย",
  act: "พ.ร.บ.",
  tax: "ภาษี",
};

export interface CostKpis {
  total: number;
  fuel: number;
  maintenance: number;
  insuranceAct: number;
  tax: number;
  avgPerCarPerMonth: number;
}

export interface CostBreakdownRow {
  category: CostCategory;
  amount: number;
}

export interface TcoRow {
  carId: string;
  carName: string;
  licensePlate: string | null;
  carType: string | null;
  fuel: number;
  maintenance: number;
  insurance: number;
  act: number;
  tax: number;
  total: number;
  repairCount: number;
  usageDays: number;
  costPerUsageDay: number;
}

export interface TopVehicleCost {
  carId: string;
  carName: string;
  total: number;
}

export interface TopVendor {
  vender: string;
  amount: number;
  count: number;
}

export interface CostSummary {
  kpis: CostKpis;
  previousKpis: CostKpis;
  breakdown: CostBreakdownRow[];
  perVehicle: TcoRow[];
  topVehicles: TopVehicleCost[];
  topVendors: TopVendor[];
  activeCars: number;
  docsWithoutPaidDate: number;
}

export interface CostTrendRow {
  label: string;
  fuel: number;
  maintenance: number;
  insurance: number;
  act: number;
  tax: number;
  total: number;
}

export interface FuelBudgetRow {
  carId: string;
  carName: string;
  licensePlate: string | null;
  limit: number;
  actual: number;
  variance: number;
  overBudget: boolean;
  usedPercent: number;
}

export interface FuelBudget {
  year: number;
  month: number;
  rows: FuelBudgetRow[];
  excludedCount: number;
  totalLimit: number;
  totalActual: number;
  overBudgetCount: number;
}

export interface ForecastMonth {
  label: string;
  insurance: number;
  act: number;
  tax: number;
  total: number;
}

export interface ForecastItem {
  carId: string;
  carName: string;
  licensePlate: string | null;
  docType: string;
  expireDate: string;
  lastCost: number;
  vender: string | null;
  overdue: boolean;
}

export interface RenewalForecast {
  months: ForecastMonth[];
  items: ForecastItem[];
  missing: { carId: string; carName: string; docType: string }[];
  grandTotal: number;
}

const EMPTY_KPIS: CostKpis = {
  total: 0,
  fuel: 0,
  maintenance: 0,
  insuranceAct: 0,
  tax: 0,
  avgPerCarPerMonth: 0,
};

/** ค่าเริ่มต้นว่างเปล่า — กัน null ตอน error/loading */
export const EMPTY_SUMMARY: CostSummary = {
  kpis: EMPTY_KPIS,
  previousKpis: EMPTY_KPIS,
  breakdown: [],
  perVehicle: [],
  topVehicles: [],
  topVendors: [],
  activeCars: 0,
  docsWithoutPaidDate: 0,
};

export const EMPTY_FUEL_BUDGET: FuelBudget = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  rows: [],
  excludedCount: 0,
  totalLimit: 0,
  totalActual: 0,
  overBudgetCount: 0,
};

export const EMPTY_FORECAST: RenewalForecast = {
  months: [],
  items: [],
  missing: [],
  grandTotal: 0,
};

/** บริการรายงานค่าใช้จ่ายฟลีต (admin / บัญชี / ma-user) */
export const ReportServices = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/ma-car-report";
  return {
    /** สรุปค่าใช้จ่ายในช่วงเวลา (from/to = ISO date string) */
    getCostSummary: async (from?: string, to?: string): Promise<CostSummary> =>
      await axiosInstance
        .get(`${baseUrl}/cost-summary`, { params: { from, to } })
        .then((res) => res.data as CostSummary)
        .catch((err) => {
          console.log(err);
          return EMPTY_SUMMARY;
        }),

    /** แนวโน้มค่าใช้จ่ายรายเดือนแยกหมวด ตลอดปี */
    getCostTrend: async (year: number): Promise<CostTrendRow[]> =>
      await axiosInstance
        .get(`${baseUrl}/cost-trend`, { params: { year } })
        .then((res) => res.data as CostTrendRow[])
        .catch((err) => {
          console.log(err);
          return [];
        }),

    /** วงเงินบัตรน้ำมัน vs การใช้จริง ในเดือนที่เลือก */
    getFuelBudget: async (year: number, month: number): Promise<FuelBudget> =>
      await axiosInstance
        .get(`${baseUrl}/fuel-budget`, { params: { year, month } })
        .then((res) => res.data as FuelBudget)
        .catch((err) => {
          console.log(err);
          return EMPTY_FUEL_BUDGET;
        }),

    /** ประมาณการค่าต่อเอกสาร 12 เดือนข้างหน้า */
    getRenewalForecast: async (): Promise<RenewalForecast> =>
      await axiosInstance
        .get(`${baseUrl}/renewal-forecast`)
        .then((res) => res.data as RenewalForecast)
        .catch((err) => {
          console.log(err);
          return EMPTY_FORECAST;
        }),
  };
};
