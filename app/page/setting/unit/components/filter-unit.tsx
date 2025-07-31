import { FilterOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, FormInstance, Input, Popover, Space } from "antd";
import { Dayjs } from "dayjs";
import React from "react";
import { ITUnit } from "../common";

export interface props {
  onFilters: (values: { unitName?: string; createdAt?: Dayjs | string }) => void;
  form: FormInstance;
  handleFilter: (status: boolean) => void;
  openFilter: boolean;
  handleManage: (status: boolean, type: string, values?: ITUnit) => void;
}

const FilterUnitPage: React.FC<props> = ({ onFilters, form, handleFilter, openFilter, handleManage }): React.ReactElement => {
  const { RangePicker } = DatePicker;
  const searchContent = (
    <Form form={form} onFinish={onFilters} layout="vertical" autoComplete="off">
      <div className="grid grid-cols-4 gap-2">
        <div className="grid col-span-1">
          <Form.Item name={"unitName"} label={`ชื่อ Unit`}>
            <Input placeholder="Input" />
          </Form.Item>
        </div>
        <div className="grid col-span-1">
          <Form.Item name={"createdAt"} label={`วันที่สร้าง`}>
            <RangePicker />
          </Form.Item>
        </div>
        <div className="grid col-span-1 items-center">
          <Button className="w-20" htmlType="submit" type={"primary"}>{`ค้นหา`}</Button>
        </div>
      </div>
    </Form>
  );
  return (
    <div>
      <div className="flex justify-between p-1">
        <Popover
          onOpenChange={(e) => handleFilter(e)}
          open={openFilter}
          content={searchContent}
          title="Search"
          trigger="click"
          overlayStyle={{ width: "calc(100% - 240px)" }}>
          <Button icon={<FilterOutlined />}>Filters</Button>
        </Popover>
        <Button type="primary" onClick={() => handleManage(true, "create", undefined)}>
          เพิ่ม
        </Button>
      </div>
    </div>
  );
};

export default FilterUnitPage;
