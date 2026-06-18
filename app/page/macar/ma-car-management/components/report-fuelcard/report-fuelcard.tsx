import { loadAppConfig } from "@/app/config/app-config";
import { useId24 } from "@/components/drivers/id24/Id24Provider";
import { Form, message, TablePaginationConfig } from "antd";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import React, { useEffect, useState } from "react";
import type { Dayjs } from "dayjs";
import ReportFuelCardChart from "./components/report-fuelcard-chart";
import ReportFuelCardChartFilter from "./components/report-fuelcard-chart-filter";
import ReportFuelCardFilter, { FilterFormValues } from "./components/report-fuelcard-filter";
import ReportFuelCardTable from "./components/report-fuelcard-table";
import {
  CarOption,
  FuelChartBucket,
  FuelTransactionRow,
  ReportFuelFilters,
  ReportFuelService,
} from "./services/report-fuel.service";

/**
 * Fuel-transaction report tab: a monthly bar chart with its own car/month-range
 * filter, above a separately filterable, paginated table with Excel export.
 * All data comes from the report service.
 */
const ReportFeulCard: React.FC = (): React.ReactElement => {
  const { id24Axios } = useId24();
  const baseUrlReport = id24Axios(loadAppConfig().NEXT_PUBLIC_API_BASE_URL_REPORT);
  const reportFuelService = ReportFuelService(baseUrlReport);

  const [filterForm] = Form.useForm();
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [carOptions, setCarOptions] = useState<CarOption[]>([]);
  const [filters, setFilters] = useState<ReportFuelFilters>({});

  const [tableData, setTableData] = useState<FuelTransactionRow[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [tableLoading, setTableLoading] = useState<boolean>(true);

  const [chartData, setChartData] = useState<FuelChartBucket[]>([]);
  const [chartLoading, setChartLoading] = useState<boolean>(true);
  // Chart filters are independent of the table filters above.
  const [chartCarId, setChartCarId] = useState<string | undefined>(undefined);
  const [chartMonthRange, setChartMonthRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(5, "month").startOf("month"),
    dayjs().endOf("month"),
  ]);

  const [exporting, setExporting] = useState<boolean>(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Load car dropdown options once.
  // `reportFuelService` is recreated each render (id24Axios returns a fresh
  // instance), so it is intentionally omitted from the deps to avoid a loop.
  useEffect(() => {
    const fetchCars = async () => {
      const options = await reportFuelService.getCars();
      setCarOptions(options);
    };
    fetchCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload the table whenever filters or pagination change.
  useEffect(() => {
    const fetchTable = async () => {
      setTableLoading(true);
      const skip = (Number(pagination.current) - 1) * Number(pagination.pageSize);
      const take = Number(pagination.pageSize);
      const result = await reportFuelService.findTable(filters, skip, take);
      setTableData(result.data);
      setTotal(result.count);
      setTableLoading(false);
    };
    fetchTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination]);

  // Reload the chart whenever its own car/month-range filter changes.
  useEffect(() => {
    const fetchChart = async () => {
      setChartLoading(true);
      const [start, end] = chartMonthRange;
      const result = await reportFuelService.getChart(
        chartCarId,
        start.startOf("month").toISOString(),
        end.endOf("month").toISOString(),
      );
      setChartData(result);
      setChartLoading(false);
    };
    fetchChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartCarId, chartMonthRange]);

  const changePagination = (page: TablePaginationConfig) => {
    setPagination({ ...page });
  };

  const onSearch = (values: FilterFormValues) => {
    const { carId, dateRange, actionStatus } = values || {};
    const nextFilters: ReportFuelFilters = {
      ...(carId && { carId }),
      ...(actionStatus && { actionStatus }),
      ...(dateRange &&
        dateRange.length === 2 && {
          startDate: dayjs(dateRange[0]).toISOString(),
          endDate: dayjs(dateRange[1]).toISOString(),
        }),
    };
    setFilters(nextFilters);
    setPagination((prev) => ({ ...prev, current: 1 }));
    setOpenFilter(false);
  };

  const onExport = async () => {
    setExporting(true);
    try {
      const data = await reportFuelService.export(filters);
      if (data) {
        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `รายงานการเติมน้ำมัน-${dayjs(new Date()).format("YYYYMMDDHHmmss")}.xlsx`);
        message.success("ดาวน์โหลดสำเร็จ");
      } else {
        message.error("ไม่สามารถดาวน์โหลดไฟล์ได้");
      }
    } catch (error) {
      message.error(`${error}`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <ReportFuelCardChartFilter
        carOptions={carOptions}
        carId={chartCarId}
        monthRange={chartMonthRange}
        onCarChange={setChartCarId}
        onMonthRangeChange={setChartMonthRange}
      />
      <ReportFuelCardChart data={chartData} loading={chartLoading} />
      <ReportFuelCardFilter
        filterForm={filterForm}
        carOptions={carOptions}
        openFilter={openFilter}
        handleOpenFilter={setOpenFilter}
        onSearch={onSearch}
        onExport={onExport}
        exporting={exporting}
      />
      <ReportFuelCardTable
        dataSource={tableData}
        loading={tableLoading}
        total={total}
        pagination={pagination}
        changePagination={changePagination}
      />
    </div>
  );
};

export default ReportFeulCard;
