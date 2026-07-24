import { AxiosInstance } from "axios";

export interface DashboardKpis {
  totalBookings: number;
  approvedRate: number;
  utilization: number;
  activeCars: number;
  fuelSpend: number;
  maintenanceSpend: number;
  docExpiringSoon: number;
}
export interface TopBooker {
  userId: string;
  name: string;
  count: number;
  days: number;
}
export interface TopVehicle {
  carId: string;
  carName: string;
  count: number;
  days: number;
}
export interface PerVehicleRow {
  carId: string;
  carName: string;
  licensePlate: string | null;
  bookings: number;
  days: number;
  utilization: number;
  fuelCost: number;
  maintenanceCost: number;
}
export interface StatusBucket {
  status: string;
  count: number;
}
export interface DestinationBucket {
  place: string;
  count: number;
}
export interface CompositionBucket {
  type: string;
  count: number;
}
export interface DocExpiryRow {
  documentId: string;
  carId: string;
  carName: string | null;
  docType: string;
  expireDate: string;
}
export interface DashboardOverview {
  kpis: DashboardKpis;
  topBookers: TopBooker[];
  topVehicles: TopVehicle[];
  perVehicle: PerVehicleRow[];
  statusBreakdown: StatusBucket[];
  destinations: DestinationBucket[];
  fleetComposition: CompositionBucket[];
  docExpiry: DocExpiryRow[];
}
export interface TrendBucket {
  label: string;
  count: number;
}

/** ค่าเริ่มต้นว่างเปล่า — กัน null ตอน error/loading */
export const EMPTY_OVERVIEW: DashboardOverview = {
  kpis: {
    totalBookings: 0,
    approvedRate: 0,
    utilization: 0,
    activeCars: 0,
    fuelSpend: 0,
    maintenanceSpend: 0,
    docExpiringSoon: 0,
  },
  topBookers: [],
  topVehicles: [],
  perVehicle: [],
  statusBreakdown: [],
  destinations: [],
  fleetComposition: [],
  docExpiry: [],
};

/** บริการแดชบอร์ดฟลีต (admin) */
export const DashboardServices = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/ma-car-dashboard";
  return {
    /** ข้อมูลรวมในช่วงเวลา (from/to = ISO date string) */
    getOverview: async (
      from?: string,
      to?: string,
    ): Promise<DashboardOverview> =>
      await axiosInstance
        .get(`${baseUrl}/overview`, { params: { from, to } })
        .then((res) => res.data as DashboardOverview)
        .catch((err) => {
          console.log(err);
          return EMPTY_OVERVIEW;
        }),

    /** แนวโน้มการจอง 12 เดือน */
    getBookingTrend: async (): Promise<TrendBucket[]> =>
      await axiosInstance
        .get(`${baseUrl}/booking-trend`)
        .then((res) => res.data as TrendBucket[])
        .catch((err) => {
          console.log(err);
          return [];
        }),
  };
};
