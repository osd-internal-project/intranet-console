import {
  CheckCircleOutlined,
  CheckSquareOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FilterOutlined,
  RollbackOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, DatePicker, Popover, FormInstance, Select } from "antd";
import React from "react";

export interface props {
  handleOpenFilter: (value: boolean) => void;
  openFilter: boolean;
  filterForm: FormInstance;
  onSearch: (value: { carBookApprovedStatus?: string; carBookStartDate?: Date | string; createdByName?: string }) => void;
}

const ManagementCarFilterPage: React.FC<props> = ({ handleOpenFilter, openFilter, filterForm, onSearch }): React.ReactElement => {
  const { RangePicker } = DatePicker;

  const searchContent = (
    <Form layout="vertical" form={filterForm} onFinish={onSearch} autoComplete="off">
      <div className="grid grid-cols-1 md:gap-4 ">
        <Form.Item label="สถานะ" name="carBookApprovedStatus">
          <Select
            allowClear
            className="w-full"
            showSearch
            optionFilterProp="label"
            placeholder="Select Status"
            options={[
              {
                value: "Process",
                label: (
                  <>
                    <ClockCircleOutlined style={{ marginRight: 6, color: "#faad14" }} />
                    กำลังรออนุมัติ
                  </>
                ),
              },
              {
                value: "Approve",
                label: (
                  <>
                    <CheckCircleOutlined style={{ marginRight: 6, color: "#52c41a" }} />
                    อนุมัติสำเร็จ
                  </>
                ),
              },
              {
                value: "Cancel",
                label: (
                  <>
                    <CloseCircleOutlined style={{ marginRight: 6, color: "#ff4d4f" }} />
                    ยกเลิก
                  </>
                ),
              },
              {
                value: "DisapProved",
                label: (
                  <>
                    <StopOutlined style={{ marginRight: 6, color: "#eb2f96" }} />
                    ไม่อนุมัติ
                  </>
                ),
              },
              {
                value: "Return",
                label: (
                  <>
                    <RollbackOutlined style={{ marginRight: 6, color: "#1890ff" }} />
                    แจ้งคืนรถแล้ว
                  </>
                ),
              },
              {
                value: "Completed",
                label: (
                  <>
                    <CheckSquareOutlined style={{ marginRight: 6, color: "#389e0d" }} />
                    คืนรถสำเร็จ
                  </>
                ),
              },
            ]}
          />
        </Form.Item>
        <Form.Item label="ชื่อ - สกุล" name="createdByName">
          <Input placeholder="Search Text" />
        </Form.Item>

        <Form.Item label="วันที่จองรถ" name="carBookStartDate">
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
        content={<div style={{ width: "700px", minWidth: 0 }}>{searchContent}</div>}
        placement="bottomLeft"
        title="Search"
        trigger="click">
        <Button type="primary" icon={<FilterOutlined />}>
          Filters
        </Button>
      </Popover>
    </div>
  );
};

export default ManagementCarFilterPage;
