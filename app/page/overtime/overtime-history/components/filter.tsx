import { IOverTimeForm } from "@/app/common/overtime";
import { ExcelIcon } from "@/components/icon";
import { FilterOutlined } from "@ant-design/icons";
import { Button, Form, Input, DatePicker, Popover, FormInstance, Select } from "antd";
import React from "react";

export interface props {
  handleOpenFilter: (value: boolean) => void;
  openFilter: boolean;
  filterForm: FormInstance;
  onSearch: (value: object) => void;
  handleExport: () => void;
  dataResource: { data: IOverTimeForm[]; total: number };
}

export const FilterOverTimeHistory: React.FC<props> = ({
  handleOpenFilter,
  openFilter,
  filterForm,
  onSearch,
  dataResource,
  handleExport,
}): React.ReactElement => {
  const { RangePicker } = DatePicker;

  const searchContent = (
    <Form layout="vertical" form={filterForm} onFinish={onSearch} autoComplete="off">
      <div className="grid grid-cols-1 md:gap-4 ">
        <Form.Item label="สถานะ" name="status">
          <Select
            allowClear
            className="w-full"
            showSearch
            optionFilterProp="label"
            placeholder="Select Status"
            options={[
              { value: "waiting", label: "กำลังรออนุมัติ" },
              { value: "approved", label: "อนุมัติสำเร็จ" },
              { value: "cancel", label: "ยกเลิก" },
              { value: "reject", label: "ไม่อนุมัติ" },
            ]}
          />
        </Form.Item>
        <Form.Item label="ชื่อ" name="fullname">
          <Input placeholder="Search Text" />
        </Form.Item>
        <Form.Item label="วันที่ทำ OT (ประเภท)" name="typeDate">
          <Select
            allowClear
            className="w-full"
            showSearch
            optionFilterProp="label"
            placeholder="Select Value"
            options={[
              { value: "normall", label: "วันปกติ" },
              { value: "dayoff", label: "วันหยุด" },
            ]}
          />
        </Form.Item>
        <Form.Item label="วันที่ทำ OT" name="dateStart">
          <RangePicker className="w-full" />
        </Form.Item>
        <div className="md:col-span-4 text-right">
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
        content={<div style={{ width: "auto", minWidth: 0 }}>{searchContent}</div>}
        placement="bottomLeft"
        title="Search"
        trigger="click">
        <Button type="primary" icon={<FilterOutlined />}>
          Filters
        </Button>
      </Popover>
      <Button type="default" disabled={dataResource.data.length === 0} onClick={handleExport} icon={<ExcelIcon width="1.5rem" height="1.5rem" />}>
        {`ดาวน์โหลดไฟล์`}
      </Button>
    </div>
  );
};
