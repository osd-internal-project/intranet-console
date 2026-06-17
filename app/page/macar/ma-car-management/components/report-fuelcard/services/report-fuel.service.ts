import { AxiosInstance } from "axios";

/** Filters shared by the fuel-transaction table and export. */
export interface ReportFuelFilters {
  carId?: string;
  startDate?: string;
  endDate?: string;
  actionStatus?: string;
}

/** Dropdown option for the car filter. */
export interface CarOption {
  value: string;
  label: string;
}

/** A single month bucket returned by the chart endpoint. */
export interface FuelChartBucket {
  year: number;
  month: number;
  label: string;
  amount: number;
}

/** One row of the fuel-transaction table. */
export interface FuelTransactionRow {
  id: number;
  date: string;
  carId: string;
  carName: string;
  amount: string | number;
  remaining: string | number;
  actionStatus: string | null;
  actionStatusLabel: string;
  description: string | null;
  bookedBy: string;
  recipientName: string;
  carBookStartDate: string | null;
  carBookEndDate: string | null;
}

/** Paginated table response. */
export interface FuelTableResponse {
  data: FuelTransactionRow[];
  count: number;
}

/**
 * Service factory for the fuel-transaction report. The axios instance must be
 * built from the REPORT base URL (its global prefix already includes `/api`).
 * @param axiosInstance Pre-configured axios pointing at the report service.
 */
export const ReportFuelService = (axiosInstance: AxiosInstance) => {
  const baseUrl = "/report-fuel";

  return {
    /** Car dropdown options ({ value: carId, label: carName }). */
    getCars: async (): Promise<CarOption[]> => {
      return await axiosInstance
        .get(`${baseUrl}/cars`)
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    /** Monthly fuel-usage buckets (last 6 months, `use` only). */
    getChart: async (carId?: string): Promise<FuelChartBucket[]> => {
      return await axiosInstance
        .get(`${baseUrl}/chart`, { params: carId ? { carId } : {} })
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return [];
        });
    },

    /** Paginated, filterable fuel-transaction table. */
    findTable: async (filters: ReportFuelFilters, skip: number, take: number): Promise<FuelTableResponse> => {
      return await axiosInstance
        .get(`${baseUrl}`, { params: { ...filters, skip, take } })
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return { data: [], count: 0 };
        });
    },

    /** Export the filtered transactions as an Excel blob. */
    export: async (filters: ReportFuelFilters): Promise<ArrayBuffer | null> => {
      return await axiosInstance
        .get(`${baseUrl}/export`, { params: filters, responseType: "blob" })
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return null;
        });
    },
  };
};
