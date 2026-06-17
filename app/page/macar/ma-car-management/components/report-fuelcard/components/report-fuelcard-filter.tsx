import { ExcelIcon } from "@/components/icon";
import { FilterOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, FormInstance, Popover, Select } from "antd";
import type { Dayjs } from "dayjs";
import React from "react";
import { CarOption } from "../services/report-fuel.service";

export interface FilterFormValues {
  carId?: string;
  dateRange?: [Dayjs, Dayjs];
  actionStatus?: string;
}

export interface props {
  filterForm: FormInstance;
  carOptions: CarOption[];
  openFilter: boolean;
  handleOpenFilter: (value: boolean) => void;
  onSearch: (values: FilterFormValues) => void;
  onExport: () => void;
  exporting: boolean;
}

/** Options for the transaction-type filter. */
const actionStatusOptions = [
  { value: "use", label: "เติม" },
  { value: "reset", label: "รอบใหม่" },
  { value: "adjust", label: "แก้ไข" },
];

/**
 * Filter bar for the fuel-transaction report: car dropdown, date range,
 * transaction type, plus the Excel export button.
 */
const ReportFuelCardFilter: React.FC<props> = ({
  filterForm,
  carOptions,
  openFilter,
  handleOpenFilter,
  onSearch,
  onExport,
  exporting,
}): React.ReactElement => {
  const { RangePicker } = DatePicker;

  const searchContent = (
    <Form layout="vertical" form={filterForm} onFinish={onSearch} autoComplete="off">
      <div className="grid grid-cols-1 md:gap-4">
        <Form.Item label="ชื่อรถ" name="carId">
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            className="w-full"
            placeholder="เลือกรถ"
            options={carOptions}
          />
        </Form.Item>
        <Form.Item label="ประเภทรายการ" name="actionStatus">
          <Select allowClear className="w-full" placeholder="เลือกประเภทรายการ" options={actionStatusOptions} />
        </Form.Item>
        <Form.Item label="ช่วงวันที่" name="dateRange">
          <RangePicker className="w-full" />
        </Form.Item>
        <div className="text-right">
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </div>
      </div>
    </Form>
  );

  return (
    <div className="flex justify-between mb-3">
      <Popover
        onOpenChange={handleOpenFilter}
        open={openFilter}
        content={<div style={{ width: "400px", minWidth: 0 }}>{searchContent}</div>}
        placement="bottomLeft"
        title="Search"
        trigger="click">
        <Button type="primary" icon={<FilterOutlined />}>
          Filters
        </Button>
      </Popover>
      <Button type="default" loading={exporting} onClick={onExport} icon={<ExcelIcon width="1.5rem" height="1.5rem" />}>
        {`ดาวน์โหลดไฟล์`}
      </Button>
    </div>
  );
};

export default ReportFuelCardFilter;
