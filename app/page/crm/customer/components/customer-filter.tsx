import React, { useState } from "react";
import type {
  BadgeProps,
  CalendarProps,
  TableColumnsType,
  TableColumnType,
} from "antd";
import {
  Badge,
  Button,
  Calendar,
  Collapse,
  DatePicker,
  Form,
  Input,
  Modal,
  Popover,
  Select,
  Switch,
  Table,
  Tag,
} from "antd";
import type { Dayjs } from "dayjs";
import { ITCustomerForm, ITPagination } from "../common";
import { ColumnType } from "antd/es/table";
import { dateToStringThNoTime } from "@/app/utils/format";
import { FilterOutlined } from "@ant-design/icons";
import { exportIcon } from "@/components/icon";
const { RangePicker } = DatePicker;
export interface props {
  onFinishFilter: (form: ITCustomerForm) => void;
}

const CustomerFilterComponent: React.FC<props> = ({
  onFinishFilter,
}): React.ReactElement => {
  return (
    <Collapse
      bordered={false}
      items={[
        {
          key: "1",
          label: <b>Filter</b>,
          children: (
            <Form
              size="small"
              layout="vertical"
              onFinish={onFinishFilter}
              // form={filterForm}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Form.Item name={"maName"} label={"MA Name"}>
                  <Input />
                </Form.Item>
                <Form.Item name={"maDate"} label={"วันที่นัดหมาย"}>
                  <RangePicker
                    className=" w-full"
                    format={"DD/MM/YYYY"}
                    allowClear={true}
                  />
                </Form.Item>
                <Form.Item name={"contact"} label={"ผู้นัดหมาย"}>
                  <Input />
                </Form.Item>
                <Form.Item name={"maStatus"} label={"สถานะ"}>
                  <Select
                    allowClear
                    options={[
                      { label: "รอดำเนินการ", value: "process" },
                      { label: "สำเร็จ", value: "success" },
                      { label: "ยกเลิก", value: "cancel" },
                    ]}
                  />
                </Form.Item>
              </div>
              <div className=" flex justify-end space-x-2">
                <Button type="primary" htmlType="submit">
                  Search
                </Button>
                {/* <Button
                  type="primary"
                  ghost
                  icon={exportIcon}
                  // onClick={handdleExport}
                >
                  {`Export`}
                </Button> */}
              </div>
            </Form>
          ),
        },
      ]}
      defaultActiveKey={["1"]}
    />
  );
};

export default CustomerFilterComponent;
