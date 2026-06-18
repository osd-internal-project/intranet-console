import { DatePicker, Select } from "antd";
import type { Dayjs } from "dayjs";
import React from "react";
import { CarOption } from "../services/report-fuel.service";

export interface props {
  carOptions: CarOption[];
  carId?: string;
  monthRange: [Dayjs, Dayjs];
  onCarChange: (carId?: string) => void;
  onMonthRangeChange: (range: [Dayjs, Dayjs]) => void;
}

const { RangePicker } = DatePicker;

/**
 * Inline (no-Popover) filter bar for the fuel-usage chart: a car dropdown and a
 * month range picker. Both are controlled by the parent so changes re-fetch the
 * chart immediately.
 */
const ReportFuelCardChartFilter: React.FC<props> = ({
  carOptions,
  carId,
  monthRange,
  onCarChange,
  onMonthRangeChange,
}): React.ReactElement => {
  /**
   * Forward a complete month range to the parent. The picker can emit nulls
   * (e.g. while clearing); those partial states are ignored.
   */
  const handleRangeChange = (range: (Dayjs | null)[] | null): void => {
    if (range && range[0] && range[1]) {
      onMonthRangeChange([range[0], range[1]]);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-3">
      <Select
        allowClear
        showSearch
        optionFilterProp="label"
        style={{ minWidth: 200 }}
        placeholder="เลือกรถ"
        options={carOptions}
        value={carId}
        onChange={(value: string | undefined) => onCarChange(value)}
      />
      <RangePicker picker="month" allowClear={false} value={monthRange} onChange={handleRangeChange} />
    </div>
  );
};

export default ReportFuelCardChartFilter;
